import { BaseRepository } from '@/lib/common/base-repository';
import { Result, success, failure } from '@/lib/common/result';
import { RepositoryError } from '@/lib/common/errors';
import type { Profile } from '@/domain/subscriptions/types';

export class ProfileRepository extends BaseRepository {
  async findById(id: string): Promise<Result<Profile, RepositoryError>> {
    const result = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    return this.handleSingleResult(result, 'read', 'Profile');
  }

  async findByEmail(
    email: string
  ): Promise<Result<Profile | null, RepositoryError>> {
    // Profile doesn't store email — it lives in auth.users
    // So we look up auth.users by email, then find the matching profile
    const { data: authData, error: authError } =
      await this.supabase.auth.admin.listUsers();

    if (authError) {
      return failure({
        code: 'DATABASE_ERROR',
        name: 'DatabaseError',
        message: `Failed to look up user by email: ${authError.message}`,
        cause: authError,
      } as RepositoryError);
    }

    const authUser = authData.users.find((u) => u.email === email);
    if (!authUser) {
      return success(null);
    }

    const result = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (result.error && result.error.code === 'PGRST116') {
      return success(null);
    }

    return this.handleSingleResult(result, 'read', 'Profile');
  }

  async findByStripeCustomerId(
    stripeCustomerId: string
  ): Promise<Result<Profile | null, RepositoryError>> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', stripeCustomerId)
      .maybeSingle();

    if (error) {
      return failure(this.mapSupabaseError(error, 'read', 'Profile'));
    }

    return success(data as Profile | null);
  }

  async update(
    id: string,
    updates: Partial<
      Pick<
        Profile,
        'stripe_customer_id' | 'display_name' | 'account_claimed_at'
      >
    >
  ): Promise<Result<Profile, RepositoryError>> {
    const result = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return this.handleSingleResult(result, 'update', 'Profile');
  }
}
