import { BaseRepository } from '@/lib/common/base-repository';
import { Result, success } from '@/lib/common/result';
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
} from '@/lib/common/errors';
import type {
  Tables,
  TablesInsert,
  Count,
  SortOrder,
} from '@/lib/supabase/database/types';

export interface RolesQueryOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    name?: string;
  };
  select?: (keyof Tables<'creative_roles'>)[];
  sort?: {
    column?: keyof Tables<'creative_roles'>;
    order: SortOrder;
  };
  limit?: number;
}

export interface RoleQueryResult {
  data: Tables<'creative_roles'>[];
  count: number | null;
}

export class RoleRepository extends BaseRepository {
  async create(
    data: TablesInsert<'creative_roles'>
  ): Promise<Result<Tables<'creative_roles'>, RepositoryError>> {
    const result = await this.supabase
      .from('creative_roles')
      .insert(data)
      .select()
      .single();
    return this.handleSingleResult(result, 'create', 'Role');
  }

  async findById(
    id: number
  ): Promise<Result<Tables<'creative_roles'>, DatabaseError | NotFoundError>> {
    const result = await this.query({ filter: { id } });
    if (!result.success) {
      return result as Result<Tables<'creative_roles'>, DatabaseError>;
    }

    const role = result.data.data[0];
    if (!role) {
      return this.notFound('Role', id);
    }

    return success(role);
  }

  async query(
    options: RolesQueryOptions = { sort: { order: 'desc' } }
  ): Promise<Result<RoleQueryResult, RepositoryError>> {
    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = this.supabase
      .from('creative_roles')
      .select(selectColumns as '*', {
        count: options.count,
        head: options.onlyCount ?? false,
      });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }
    if (options.filter?.name) {
      query = query.eq('name', options.filter.name);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const result = await query;
    return this.handleQueryResult(result, 'Role');
  }

  async update(
    data: Tables<'creative_roles'>
  ): Promise<Result<Tables<'creative_roles'>, RepositoryError>> {
    const idResult = this.requireId(data.id, 'Role');
    if (!idResult.success) {
      return idResult as Result<Tables<'creative_roles'>, DatabaseError>;
    }

    const result = await this.supabase
      .from('creative_roles')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    return this.handleSingleResult(result, 'update', 'Role');
  }

  async delete(
    id: number
  ): Promise<Result<Tables<'creative_roles'>, RepositoryError>> {
    const result = await this.supabase
      .from('creative_roles')
      .delete()
      .eq('id', id)
      .select()
      .single();
    return this.handleSingleResult(result, 'delete', 'Role');
  }

  async count(
    filter?: RolesQueryOptions['filter']
  ): Promise<Result<number, DatabaseError>> {
    const result = await this.query({
      onlyCount: true,
      count: 'exact',
      filter,
    });
    if (!result.success) {
      return result as Result<number, DatabaseError>;
    }

    return success(result.data.count ?? 0);
  }
}
