import { BaseRepository } from '@/lib/common/base-repository';
import { Result } from '@/lib/common/result';
import { RepositoryError } from '@/lib/common/errors';
import type { AddonProduct } from '@/domain/subscriptions/types';

export class AddonProductRepository extends BaseRepository {
  async findAll(
    activeOnly = true
  ): Promise<
    Result<{ data: AddonProduct[]; count: number | null }, RepositoryError>
  > {
    let query = this.supabase
      .from('addon_products')
      .select('*')
      .order('created_at', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const result = await query;

    return this.handleQueryResult(result, 'Addon Products');
  }

  async findById(id: string): Promise<Result<AddonProduct, RepositoryError>> {
    let query = this.supabase
      .from('addon_products')
      .select('*')
      .eq('id', id)
      .single();

    const result = await query;

    return this.handleSingleResult(result, 'read', 'Addon Products');
  }

  async create(
    product: Pick<AddonProduct, 'name' | 'description' | 'image_url'>
  ): Promise<Result<AddonProduct, RepositoryError>> {
    const result = await this.supabase
      .from('addon_products')
      .insert(product)
      .select()
      .single();

    return this.handleSingleResult(result, 'create', 'Addon Products');
  }

  async update(
    id: string,
    updates: Partial<Pick<AddonProduct, 'name' | 'description' | 'image_url'>>
  ): Promise<Result<AddonProduct, RepositoryError>> {
    const result = await this.supabase
      .from('addon_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return this.handleSingleResult(result, 'update', 'Addon Products');
  }

  async deactivate(id: string): Promise<Result<null, RepositoryError>> {
    const result = await this.supabase
      .from('addon_products')
      .update({ is_active: false })
      .eq('id', id);

    return this.handleSingleResult(result, 'update', 'Addon Products');
  }
}
