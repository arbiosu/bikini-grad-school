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

export interface ContributorsQueryOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    name?: string;
    role_id?: number;
  };
  select?: (keyof Tables<'contributors'>)[];
  sort?: {
    column?: keyof Tables<'contributors'>;
    order: SortOrder;
  };
  limit?: number;
}

export interface ContributorsQueryResult {
  data: Tables<'contributors'>[];
  count: number | null;
}

export class ContributorRespository extends BaseRepository {
  async create(
    data: TablesInsert<'contributors'>
  ): Promise<Result<Tables<'contributors'>, RepositoryError>> {
    const result = await this.supabase
      .from('contributors')
      .insert(data)
      .select()
      .single();
    return this.handleSingleResult(result, 'create', 'Contributor');
  }

  async findById(
    id: number
  ): Promise<Result<Tables<'contributors'>, DatabaseError | NotFoundError>> {
    const result = await this.query({ filter: { id } });
    if (!result.success) {
      return result as Result<Tables<'contributors'>, DatabaseError>;
    }

    const contributor = result.data.data[0];
    if (!contributor) {
      return this.notFound('Contributor', id);
    }

    return success(contributor);
  }

  async query(
    options: ContributorsQueryOptions = { sort: { order: 'desc' } }
  ): Promise<Result<ContributorsQueryResult, RepositoryError>> {
    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = this.supabase
      .from('contributors')
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
    if (options.filter?.role_id) {
      query = query.eq('role_id', options.filter.role_id);
    }

    const sortColumn = options.sort?.column ?? 'created_at';
    const sortOrder = options.sort?.order ?? 'desc';

    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    if (options.limit) {
      query = query.limit(options.limit);
    }
    const result = await query;
    return this.handleQueryResult(result, 'Contributor');
  }

  async update(
    data: Tables<'contributors'>
  ): Promise<Result<Tables<'contributors'>, RepositoryError>> {
    const idResult = this.requireId(data.id, 'Contributor');
    if (!idResult.success) {
      return idResult as Result<Tables<'contributors'>, DatabaseError>;
    }
    const result = await this.supabase
      .from('contributors')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    return this.handleSingleResult(result, 'update', 'Contributor');
  }

  async delete(
    id: number
  ): Promise<Result<Tables<'contributors'>, RepositoryError>> {
    const result = await this.supabase
      .from('contributors')
      .delete()
      .eq('id', id)
      .select()
      .single();
    return this.handleSingleResult(result, 'delete', 'Issue');
  }

  async count(
    filter?: ContributorsQueryOptions['filter']
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
