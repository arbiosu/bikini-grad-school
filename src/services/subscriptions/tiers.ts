import Stripe from 'stripe';
import { TierRepository } from '@/repositories/subscriptions/tiers';
import { Result, success, failure } from '@/lib/common/result';
import {
  ExternalServiceError,
  ServiceError,
  PartialOperationError,
  RepositoryError,
  ServiceRepositoryError,
} from '@/lib/common/errors';
import {
  CreateTierDTO,
  UpdateTierDTO,
  TierWithPrices,
} from '@/domain/subscriptions/types';

export class TierService {
  constructor(
    private repo: TierRepository,
    private stripe: Stripe
  ) {}

  async list(
    activeOnly = true
  ): Promise<Result<TierWithPrices[], RepositoryError>> {
    const result = await this.repo.findAll(activeOnly);
    if (!result.success) {
      return result;
    }

    return success(result.data.data);
  }

  async getById(id: string): Promise<Result<TierWithPrices, RepositoryError>> {
    return this.repo.findById(id);
  }

  async create(
    dto: CreateTierDTO
  ): Promise<Result<TierWithPrices, ServiceError>> {
    let stripeProduct: Stripe.Product;

    try {
      stripeProduct = await this.stripe.products.create({
        name: dto.name,
        description: dto.description,
      });
    } catch (err) {
      return failure(
        new ExternalServiceError('Stripe', 'Failed to create product')
      );
    }

    const tierResult = await this.repo.create({
      name: dto.name,
      description: dto.description ?? null,
      addon_slots: dto.addon_slots,
      stripe_product_id: stripeProduct.id,
    });

    if (!tierResult.success) {
      // todo: delete stripe product?
      return failure(
        new PartialOperationError(
          'CreateTier',
          ['stripe_product_created'],
          'db_tier_insert',
          tierResult.error
        )
      );
    }

    const currency = dto.currency ?? 'usd';

    let stripeMonthlyPrice: Stripe.Price;
    let stripeAnnualPrice: Stripe.Price;

    try {
      [stripeMonthlyPrice, stripeAnnualPrice] = await Promise.all([
        this.stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: dto.prices.monthly,
          currency,
          recurring: { interval: 'month' },
        }),
        this.stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: dto.prices.annual,
          currency,
          recurring: { interval: 'year' },
        }),
      ]);
    } catch (err) {
      return failure(
        new PartialOperationError(
          'CreateTier',
          ['stripe_product_created', 'db_tier_insert'],
          'stripe_prices_insert'
        )
      );
    }

    const [monthlyPrice, annualPrice] = await Promise.all([
      this.repo.createPrice({
        tier_id: tierResult.data.id,
        stripe_price_id: stripeMonthlyPrice.id,
        amount: dto.prices.monthly,
        currency,
        interval: 'month',
      }),
      this.repo.createPrice({
        tier_id: tierResult.data.id,
        stripe_price_id: stripeAnnualPrice.id,
        amount: dto.prices.annual,
        currency,
        interval: 'year',
      }),
    ]);

    if (!monthlyPrice.success || !annualPrice.success) {
      return failure(
        new PartialOperationError(
          'CreateTier',
          ['stripe_product_created', 'db_tier_insert', 'stripe_prices_created'],
          'db_tier_price_insert'
        )
      );
    }

    return success({
      ...tierResult.data,
      prices: [monthlyPrice.data, annualPrice.data],
    });
  }

  async update(
    id: string,
    dto: UpdateTierDTO
  ): Promise<Result<TierWithPrices, ServiceError>> {
    const existing = await this.repo.findById(id);
    if (!existing.success) {
      return failure(new ServiceRepositoryError('FindTier', existing.error));
    }

    if (!existing.data.stripe_product_id) {
      return failure(
        new ExternalServiceError(
          'Stripe',
          'Tier has no associated Stripe product'
        )
      );
    }

    try {
      if (dto.name || dto.description) {
        await this.stripe.products.update(
          existing.data.stripe_product_id ?? '',
          {
            ...(dto.name && { name: dto.name }),
            ...(dto.description && { description: dto.description }),
          }
        );
      }
    } catch (error) {
      return failure(
        new ExternalServiceError('Stripe', 'Failed to update product')
      );
    }

    const updateResult = await this.repo.update(id, {
      ...(dto.name && { name: dto.name }),
      ...(dto.description && { description: dto.description }),
      ...(dto.addon_slots !== undefined && { addon_slots: dto.addon_slots }),
    });

    if (!updateResult.success) {
      return failure(
        new PartialOperationError(
          'update',
          ['stripe_update_tier'],
          'update_tier_db'
        )
      );
    }

    const updated = await this.repo.findById(id);

    if (!updated.success) {
      return failure(new ServiceRepositoryError('FindTier', updated.error));
    }
    return updated;
  }

  async deactivate(id: string): Promise<Result<null, ServiceError>> {
    const existing = await this.repo.findById(id);
    if (!existing.success) {
      return failure(new ServiceRepositoryError('FindTier', existing.error));
    }

    if (!existing.data.stripe_product_id) {
      return failure(
        new ExternalServiceError(
          'Stripe',
          'Tier has no associated Stripe product'
        )
      );
    }

    try {
      await this.stripe.products.update(existing.data.stripe_product_id, {
        active: false,
      });
      for (const price of existing.data.prices) {
        if (price.stripe_price_id && price.is_active) {
          await this.stripe.prices.update(price.stripe_price_id, {
            active: false,
          });
        }
      }
    } catch (error) {
      return failure(
        new ExternalServiceError(
          'Stripe',
          'Failed to deactivate Stripe product'
        )
      );
    }

    const priceResult = await this.repo.deactivatePriceForTier(id);
    if (!priceResult.success) {
      return failure(
        new PartialOperationError(
          'DeactivateTier',
          ['stripe_deactivated'],
          'db_deactivate_prices',
          priceResult.error
        )
      );
    }

    const deactivated = await this.repo.deactivate(id);
    if (!deactivated.success) {
      return failure(
        new PartialOperationError(
          'DeactivateTier',
          ['stripe_deactivated', 'db_deactivate_prices'],
          'db_deactivate_tier',
          deactivated.error
        )
      );
    }

    return success(null);
  }
}
