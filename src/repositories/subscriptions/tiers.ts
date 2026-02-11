import { BaseRepository } from '@/lib/common/base-repository';
import { Result } from '@/lib/common/result';
import { RepositoryError } from '@/lib/common/errors';
import type {
  SubscriptionTier,
  TierPrice,
  TierWithPrices,
} from '@/domain/subscriptions/types';

export class TierRepository extends BaseRepository {
  async findAll(
    activeOnly = true
  ): Promise<
    Result<{ data: TierWithPrices[]; count: number | null }, RepositoryError>
  > {
    let query = this.supabase
      .from('subscription_tiers')
      .select('*, prices:tier_prices(*)')
      .order('addon_slots', { ascending: true });

    if (activeOnly) {
      query = query.eq('active', true);
    }

    const result = await query;

    return this.handleQueryResult(result, 'Subscription Tiers');
  }

  async findById(id: string): Promise<Result<TierWithPrices, RepositoryError>> {
    let query = this.supabase
      .from('subscription_tiers')
      .select('*, prices:tier_prices(*)')
      .eq('id', id)
      .single();

    const result = await query;

    return this.handleSingleResult(result, 'read', 'Subscription Tiers');
  }

  async create(
    tier: Pick<
      SubscriptionTier,
      'name' | 'description' | 'addon_slots' | 'stripe_product_id'
    >
  ): Promise<Result<SubscriptionTier, RepositoryError>> {
    const result = await this.supabase
      .from('subscription_tiers')
      .insert(tier)
      .select()
      .single();

    return this.handleSingleResult(result, 'create', 'Subscription Tiers');
  }

  async update(
    id: string,
    updates: Partial<
      Pick<SubscriptionTier, 'name' | 'description' | 'addon_slots'>
    >
  ): Promise<Result<SubscriptionTier, RepositoryError>> {
    const result = await this.supabase
      .from('subscription_tiers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return this.handleSingleResult(result, 'update', 'Subscription Tiers');
  }

  async deactivate(id: string): Promise<Result<null, RepositoryError>> {
    const result = await this.supabase
      .from('subscription_tiers')
      .update({ is_active: false })
      .eq('id', id);

    return this.handleSingleResult(result, 'update', 'Subscription Tiers');
  }

  async createPrice(
    price: Pick<
      TierPrice,
      'tier_id' | 'stripe_price_id' | 'amount' | 'currency' | 'interval'
    >
  ): Promise<Result<TierPrice, RepositoryError>> {
    const result = await this.supabase
      .from('tier_prices')
      .insert(price)
      .select()
      .single();

    return this.handleSingleResult(result, 'create', 'Tier Prices');
  }

  async deactivatePrice(
    priceId: string
  ): Promise<Result<null, RepositoryError>> {
    const result = await this.supabase
      .from('tier_prices')
      .update({ is_active: false })
      .eq('id', priceId);

    return this.handleSingleResult(result, 'update', 'Tier Prices');
  }

  async deactivatePriceForTier(
    tierId: string
  ): Promise<Result<null, RepositoryError>> {
    const result = await this.supabase
      .from('tier_prices')
      .update({ is_active: false })
      .eq('tier_id', tierId);

    return this.handleSingleResult(result, 'update', 'Tier Prices');
  }
}
