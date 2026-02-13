import { BaseRepository } from '@/lib/common/base-repository';
import { Result, success, failure } from '@/lib/common/result';
import { RepositoryError } from '@/lib/common/errors';
import type {
  Subscription,
  SubscriptionAddonSelection,
  SubscriptionWithAddons,
} from '@/domain/subscriptions/types';

export class SubscriptionRepository extends BaseRepository {
  async findById(
    id: string
  ): Promise<Result<SubscriptionWithAddons, RepositoryError>> {
    const result = await this.supabase
      .from('subscriptions')
      .select('*, addon_selections:subscription_addon_selections(*)')
      .eq('id', id)
      .single();

    return this.handleSingleResult(result, 'read', 'Subscription');
  }

  async findByUserId(
    userId: string
  ): Promise<Result<SubscriptionWithAddons, RepositoryError>> {
    const result = await this.supabase
      .from('subscriptions')
      .select('*, addon_selections:subscription_addon_selections(*)')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing', 'past_due'])
      .single();

    return this.handleSingleResult(result, 'read', 'Subscription');
  }

  async findByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Result<SubscriptionWithAddons, RepositoryError>> {
    const result = await this.supabase
      .from('subscriptions')
      .select('*, addon_selections:subscription_addon_selections(*)')
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .single();

    return this.handleSingleResult(result, 'read', 'Subscription');
  }

  async hasActiveSubscription(
    userId: string
  ): Promise<Result<boolean, RepositoryError>> {
    const { data, error, count } = await this.supabase
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['active', 'trialing', 'past_due']);

    if (error) {
      return failure(this.mapSupabaseError(error, 'read', 'Subscription'));
    }

    return success((count ?? 0) > 0);
  }

  async create(
    subscription: Pick<
      Subscription,
      | 'stripe_subscription_id'
      | 'user_id'
      | 'tier_id'
      | 'tier_price_id'
      | 'status'
      | 'current_period_start'
      | 'current_period_end'
    >
  ): Promise<Result<Subscription, RepositoryError>> {
    const result = await this.supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();

    return this.handleSingleResult(result, 'create', 'Subscription');
  }

  async update(
    id: string,
    updates: Partial<
      Pick<
        Subscription,
        | 'tier_id'
        | 'tier_price_id'
        | 'status'
        | 'current_period_start'
        | 'current_period_end'
        | 'cancel_at_period_end'
      >
    >
  ): Promise<Result<Subscription, RepositoryError>> {
    const result = await this.supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return this.handleSingleResult(result, 'update', 'Subscription');
  }

  async updateByStripeId(
    stripeSubscriptionId: string,
    updates: Partial<
      Pick<
        Subscription,
        | 'tier_id'
        | 'tier_price_id'
        | 'status'
        | 'current_period_start'
        | 'current_period_end'
        | 'cancel_at_period_end'
      >
    >
  ): Promise<Result<Subscription, RepositoryError>> {
    const result = await this.supabase
      .from('subscriptions')
      .update(updates)
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .select()
      .single();

    return this.handleSingleResult(result, 'update', 'Subscription');
  }

  // --- Addon Selections ---

  async getAddonSelections(
    subscriptionId: string
  ): Promise<
    Result<
      { data: SubscriptionAddonSelection[]; count: number | null },
      RepositoryError
    >
  > {
    const result = await this.supabase
      .from('subscription_addon_selections')
      .select('*')
      .eq('subscription_id', subscriptionId);

    return this.handleQueryResult(result, 'Addon Selections');
  }

  async setAddonSelections(
    subscriptionId: string,
    addonProductIds: string[]
  ): Promise<Result<SubscriptionAddonSelection[], RepositoryError>> {
    // Delete existing selections
    const { error: deleteError } = await this.supabase
      .from('subscription_addon_selections')
      .delete()
      .eq('subscription_id', subscriptionId);

    if (deleteError) {
      return failure(
        this.mapSupabaseError(deleteError, 'delete', 'Addon Selections')
      );
    }

    // If no new selections, return empty
    if (addonProductIds.length === 0) {
      return success([]);
    }

    // Insert new selections
    const rows = addonProductIds.map((addonProductId) => ({
      subscription_id: subscriptionId,
      addon_product_id: addonProductId,
    }));

    const { data, error: insertError } = await this.supabase
      .from('subscription_addon_selections')
      .insert(rows)
      .select();

    if (insertError) {
      return failure(
        this.mapSupabaseError(insertError, 'create', 'Addon Selections')
      );
    }

    return success((data ?? []) as SubscriptionAddonSelection[]);
  }
}
