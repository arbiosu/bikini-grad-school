import Stripe from 'stripe';
import { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionRepository } from '@/repositories/subscriptions/subscriptions';
import { ProfileRepository } from '@/repositories/subscriptions/profiles';
import { TierRepository } from '@/repositories/subscriptions/tiers';
import { Result, success, failure } from '@/lib/common/result';
import {
  ServiceError,
  ExternalServiceError,
  ServiceRepositoryError,
  PartialOperationError,
  BusinessRuleError,
} from '@/lib/common/errors';
import type {
  SubscriptionWithAddons,
  SubscriptionAddonSelection,
  CreateCheckoutDTO,
  HandleCheckoutCompletedDTO,
  ChangeTierDTO,
  SwapAddonsDTO,
  Profile,
} from '@/domain/subscriptions/types';
import { EmailService } from '../email-service';

export class SubscriptionService {
  constructor(
    private subscriptionRepo: SubscriptionRepository,
    private profileRepo: ProfileRepository,
    private tierRepo: TierRepository,
    private stripe: Stripe,
    private supabaseAdmin: SupabaseClient,
    private emailService: EmailService
  ) {}

  async getByUserId(
    userId: string
  ): Promise<Result<SubscriptionWithAddons, ServiceError>> {
    const result = await this.subscriptionRepo.findByUserId(userId);
    if (!result.success) {
      return failure(
        new ServiceRepositoryError('GetSubscription', result.error)
      );
    }
    return result;
  }

  async createCheckoutSession(
    dto: CreateCheckoutDTO
  ): Promise<Result<{ url: string }, ServiceError>> {
    const tier = await this.tierRepo.findById(dto.tierId);
    if (!tier.success) {
      return failure(new ServiceRepositoryError('FindTier', tier.error));
    }
    if (!tier.data.is_active) {
      return failure(
        new BusinessRuleError(
          'inactive_tier',
          'This tier is no longer available'
        )
      );
    }
    if (dto.addonProductIds.length !== tier.data.addon_slots) {
      return failure(
        new BusinessRuleError(
          'addon_count_mismatch',
          `This tier requires exactly ${tier.data.addon_slots} add-on(s), got ${dto.addonProductIds.length}`
        )
      );
    }

    const tierPrice = tier.data.prices.find(
      (p) => p.interval === dto.interval && p.is_active
    );
    if (!tierPrice || !tierPrice.stripe_price_id) {
      return failure(
        new BusinessRuleError(
          'price_not_found',
          `No active ${dto.interval}ly price found for this tier`
        )
      );
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: tierPrice.stripe_price_id, quantity: 1 }],
        success_url: dto.successUrl,
        cancel_url: dto.cancelUrl,
        metadata: {
          tier_id: dto.tierId,
          tier_price_id: tierPrice.id,
          addon_product_ids: dto.addonProductIds.join(','),
        },
        allow_promotion_codes: true,
        submit_type: 'subscribe',
        subscription_data: {
          metadata: {
            tier_id: dto.tierId,
            tier_price_id: tierPrice.id,
            addon_product_ids: dto.addonProductIds.join(','),
          },
        },
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
        billing_address_collection: 'required',
      });

      if (!session.url) {
        return failure(
          new ExternalServiceError(
            'Stripe',
            'Checkout session created but no URL returned'
          )
        );
      }

      return success({ url: session.url });
    } catch (err) {
      console.log(err);
      return failure(
        new ExternalServiceError('Stripe', 'Failed to create checkout session')
      );
    }
  }

  // --- Webhook: Checkout Completed ---

  async handleCheckoutCompleted(
    dto: HandleCheckoutCompletedDTO
  ): Promise<Result<SubscriptionWithAddons, ServiceError>> {
    const addonProductIds = dto.metadata.addon_product_ids
      ? dto.metadata.addon_product_ids.split(',').filter(Boolean)
      : [];

    // 1. Find or create user by email
    const profileResult = await this.findOrCreateUserByEmail(
      dto.customerEmail,
      dto.stripeCustomerId
    );
    if (!profileResult.success) {
      return profileResult;
    }
    const userId = profileResult.data.id;

    // 2. Get subscription details from Stripe
    let stripeSub: Stripe.Subscription;
    try {
      stripeSub = await this.stripe.subscriptions.retrieve(
        dto.stripeSubscriptionId
      );
    } catch (err) {
      return failure(
        new ExternalServiceError('Stripe', 'Failed to retrieve subscription')
      );
    }

    // 3. Create local subscription record
    const subResult = await this.subscriptionRepo.create({
      stripe_subscription_id: dto.stripeSubscriptionId,
      user_id: userId,
      tier_id: dto.metadata.tier_id,
      tier_price_id: dto.metadata.tier_price_id,
      status: stripeSub.status,
      current_period_start: new Date(
        stripeSub.items.data[0].current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        stripeSub.items.data[0].current_period_end * 1000
      ).toISOString(),
    });

    if (!subResult.success) {
      return failure(
        new ServiceRepositoryError('CreateSubscription', subResult.error)
      );
    }

    // 4. Set addon selections
    if (addonProductIds.length > 0) {
      const selectionsResult = await this.subscriptionRepo.setAddonSelections(
        subResult.data.id,
        addonProductIds
      );
      if (!selectionsResult.success) {
        return failure(
          new PartialOperationError(
            'HandleCheckoutCompleted',
            ['user_resolved', 'subscription_created'],
            'addon_selections_insert',
            selectionsResult.error
          )
        );
      }
    }

    // 5. Return full subscription
    const fullSub = await this.subscriptionRepo.findById(subResult.data.id);
    if (!fullSub.success) {
      return failure(
        new ServiceRepositoryError('FetchCreatedSubscription', fullSub.error)
      );
    }

    return fullSub;
  }

  // --- Webhook: Subscription Updated ---

  async handleSubscriptionUpdated(
    stripeSubscription: Stripe.Subscription
  ): Promise<Result<null, ServiceError>> {
    const updateResult = await this.subscriptionRepo.updateByStripeId(
      stripeSubscription.id,
      {
        status: stripeSubscription.status,
        current_period_start: new Date(
          stripeSubscription.items.data[0].current_period_start * 1000
        ).toISOString(),
        current_period_end: new Date(
          stripeSubscription.items.data[0].current_period_end * 1000
        ).toISOString(),
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      }
    );

    if (!updateResult.success) {
      return failure(
        new ServiceRepositoryError('UpdateSubscription', updateResult.error)
      );
    }

    return success(null);
  }

  // --- Webhook: Subscription Deleted ---

  async handleSubscriptionDeleted(
    stripeSubscriptionId: string
  ): Promise<Result<null, ServiceError>> {
    const updateResult = await this.subscriptionRepo.updateByStripeId(
      stripeSubscriptionId,
      { status: 'canceled' }
    );

    if (!updateResult.success) {
      return failure(
        new ServiceRepositoryError('DeleteSubscription', updateResult.error)
      );
    }

    return success(null);
  }

  // --- User Actions: Cancel ---

  async cancel(userId: string): Promise<Result<null, ServiceError>> {
    const sub = await this.subscriptionRepo.findByUserId(userId);
    if (!sub.success) {
      return failure(new ServiceRepositoryError('FindSubscription', sub.error));
    }

    try {
      await this.stripe.subscriptions.update(sub.data.stripe_subscription_id, {
        cancel_at_period_end: true,
      });
    } catch (err) {
      return failure(
        new ExternalServiceError('Stripe', 'Failed to cancel subscription')
      );
    }

    const updateResult = await this.subscriptionRepo.update(sub.data.id, {
      cancel_at_period_end: true,
    });

    if (!updateResult.success) {
      return failure(
        new PartialOperationError(
          'CancelSubscription',
          ['stripe_cancel_scheduled'],
          'db_update_cancel_flag',
          updateResult.error
        )
      );
    }

    return success(null);
  }

  // --- User Actions: Reactivate ---

  async reactivate(userId: string): Promise<Result<null, ServiceError>> {
    const sub = await this.subscriptionRepo.findByUserId(userId);
    if (!sub.success) {
      return failure(new ServiceRepositoryError('FindSubscription', sub.error));
    }

    if (!sub.data.cancel_at_period_end) {
      return failure(
        new BusinessRuleError(
          'not_pending_cancellation',
          'Subscription is not pending cancellation'
        )
      );
    }

    try {
      await this.stripe.subscriptions.update(sub.data.stripe_subscription_id, {
        cancel_at_period_end: false,
      });
    } catch (err) {
      return failure(
        new ExternalServiceError('Stripe', 'Failed to reactivate subscription')
      );
    }

    const updateResult = await this.subscriptionRepo.update(sub.data.id, {
      cancel_at_period_end: false,
    });

    if (!updateResult.success) {
      return failure(
        new PartialOperationError(
          'ReactivateSubscription',
          ['stripe_reactivated'],
          'db_update_cancel_flag',
          updateResult.error
        )
      );
    }

    return success(null);
  }

  // --- User Actions: Change Tier ---

  async changeTier(
    dto: ChangeTierDTO
  ): Promise<Result<SubscriptionWithAddons, ServiceError>> {
    // 1. Get current subscription
    const sub = await this.subscriptionRepo.findByUserId(dto.userId);
    if (!sub.success) {
      return failure(new ServiceRepositoryError('FindSubscription', sub.error));
    }

    // 2. Validate new tier
    const newTier = await this.tierRepo.findById(dto.newTierId);
    if (!newTier.success) {
      return failure(new ServiceRepositoryError('FindTier', newTier.error));
    }
    if (!newTier.data.is_active) {
      return failure(
        new BusinessRuleError(
          'inactive_tier',
          'This tier is no longer available'
        )
      );
    }
    if (dto.addonProductIds.length !== newTier.data.addon_slots) {
      return failure(
        new BusinessRuleError(
          'addon_count_mismatch',
          `This tier requires exactly ${newTier.data.addon_slots} add-on(s), got ${dto.addonProductIds.length}`
        )
      );
    }

    // 3. Find the new price
    const newPrice = newTier.data.prices.find(
      (p) => p.interval === dto.newInterval && p.is_active
    );
    if (!newPrice || !newPrice.stripe_price_id) {
      return failure(
        new BusinessRuleError(
          'price_not_found',
          `No active ${dto.newInterval}ly price found for this tier`
        )
      );
    }

    // 4. Update Stripe subscription
    try {
      const stripeSub = await this.stripe.subscriptions.retrieve(
        sub.data.stripe_subscription_id
      );
      await this.stripe.subscriptions.update(sub.data.stripe_subscription_id, {
        items: [
          {
            id: stripeSub.items.data[0].id,
            price: newPrice.stripe_price_id,
          },
        ],
        proration_behavior: 'create_prorations',
      });
    } catch (err) {
      return failure(
        new ExternalServiceError('Stripe', 'Failed to update subscription')
      );
    }

    // 5. Update local subscription
    const updateResult = await this.subscriptionRepo.update(sub.data.id, {
      tier_id: dto.newTierId,
      tier_price_id: newPrice.id,
    });

    if (!updateResult.success) {
      return failure(
        new PartialOperationError(
          'ChangeTier',
          ['stripe_subscription_updated'],
          'db_subscription_update',
          updateResult.error
        )
      );
    }

    // 6. Replace addon selections
    const selectionsResult = await this.subscriptionRepo.setAddonSelections(
      sub.data.id,
      dto.addonProductIds
    );

    if (!selectionsResult.success) {
      return failure(
        new PartialOperationError(
          'ChangeTier',
          ['stripe_subscription_updated', 'db_subscription_updated'],
          'addon_selections_update',
          selectionsResult.error
        )
      );
    }

    // 7. Return updated subscription
    const updated = await this.subscriptionRepo.findById(sub.data.id);
    if (!updated.success) {
      return failure(
        new ServiceRepositoryError('FetchUpdatedSubscription', updated.error)
      );
    }

    return updated;
  }

  // --- User Actions: Swap Addons ---

  async swapAddons(
    dto: SwapAddonsDTO
  ): Promise<Result<SubscriptionAddonSelection[], ServiceError>> {
    // 1. Get current subscription
    const sub = await this.subscriptionRepo.findByUserId(dto.userId);
    if (!sub.success) {
      return failure(new ServiceRepositoryError('FindSubscription', sub.error));
    }

    // 2. Get tier to validate addon count
    const tier = await this.tierRepo.findById(sub.data.tier_id);
    if (!tier.success) {
      return failure(new ServiceRepositoryError('FindTier', tier.error));
    }

    if (dto.addonProductIds.length !== tier.data.addon_slots) {
      return failure(
        new BusinessRuleError(
          'addon_count_mismatch',
          `Your tier requires exactly ${tier.data.addon_slots} add-on(s), got ${dto.addonProductIds.length}`
        )
      );
    }

    // 3. Replace selections (no Stripe call needed)
    const selectionsResult = await this.subscriptionRepo.setAddonSelections(
      sub.data.id,
      dto.addonProductIds
    );

    if (!selectionsResult.success) {
      return failure(
        new ServiceRepositoryError('SwapAddons', selectionsResult.error)
      );
    }

    return selectionsResult;
  }

  private async findOrCreateUserByEmail(
    email: string,
    stripeCustomerId: string
  ): Promise<Result<Profile, ServiceError>> {
    // Check if profile already exists for this email
    const existing = await this.profileRepo.findByEmail(email);
    if (!existing.success) {
      return failure(
        new ServiceRepositoryError('FindProfileByEmail', existing.error)
      );
    }

    if (existing.data) {
      // User exists — attach Stripe customer ID if missing
      if (!existing.data.stripe_customer_id) {
        const updateResult = await this.profileRepo.update(existing.data.id, {
          stripe_customer_id: stripeCustomerId,
        });
        if (!updateResult.success) {
          return failure(
            new ServiceRepositoryError(
              'UpdateProfileStripeId',
              updateResult.error
            )
          );
        }
        return updateResult;
      }
      return success(existing.data);
    }

    // No user exists — create auth user, trigger auto-creates profile
    const { data: authData, error: authError } =
      await this.supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
      });

    if (authError) {
      return failure(
        new ExternalServiceError(
          'Supabase',
          `Failed to create auth user: ${authError.message}`
        )
      );
    }

    // Retry loop for db trigger
    const maxAttempts = 5;
    const delayMs = 500;
    let profile: Profile | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      const profileResult = await this.profileRepo.findById(authData.user.id);
      if (profileResult.success && profileResult.data) {
        profile = profileResult.data;
        break;
      }
    }

    if (!profile) {
      return failure(
        new PartialOperationError(
          'CreateUser',
          ['auth_user_created'],
          'profile_not_found_after_retries',
          new Error('Profile was not created by trigger in time')
        )
      );
    }

    // Attach Stripe customer ID to the new profile
    const updateResult = await this.profileRepo.update(authData.user.id, {
      stripe_customer_id: stripeCustomerId,
    });

    if (!updateResult.success) {
      return failure(
        new PartialOperationError(
          'CreateUser',
          ['auth_user_created'],
          'profile_stripe_id_update',
          updateResult.error
        )
      );
    }

    // Send magic link for account claiming
    const { data: linkData, error: linkError } =
      await this.supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/claim-account`,
        },
      });

    if (linkError || !linkData?.properties?.action_link) {
      console.error('Failed to generate magic link:', linkError?.message);
      // TODO send admin email
      return updateResult;
    }

    const emailResult = await this.emailService.sendWelcomeClaimEmail(
      email,
      linkData.properties.action_link
    );

    if (!emailResult.success) {
      // Non-fatal — subscription is active, they just won't get the email
      console.error('Failed to send welcome email:', emailResult.error.message);
    }

    return updateResult;
  }
}
