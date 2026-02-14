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

interface IssueQueryOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Tables<'issues'>)[];
  sort?: {
    column?: keyof Tables<'issues'>;
    order: SortOrder;
  };
  limit?: number;
}

interface IssueQueryResult {
  data: Tables<'issues'>[];
  count: number | null;
}

export class IssueRepository extends BaseRepository {
  async create(
    data: TablesInsert<'issues'>
  ): Promise<Result<Tables<'issues'>, RepositoryError>> {
    const result = await this.supabase
      .from('issues')
      .insert(data)
      .select()
      .single();
    return this.handleSingleResult(result, 'create', 'Issue');
  }

  /**
   * Find issue by id
   */
  async findById(
    id: number
  ): Promise<Result<Tables<'issues'>, DatabaseError | NotFoundError>> {
    const result = await this.query({ filter: { id } });
    if (!result.success) {
      return result as Result<Tables<'issues'>, DatabaseError>;
    }

    const issue = result.data.data[0];
    if (!issue) {
      return this.notFound('Issue', id);
    }

    return success(issue);
  }

  async query(
    options: IssueQueryOptions = { sort: { order: 'desc' } }
  ): Promise<Result<IssueQueryResult, RepositoryError>> {
    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = this.supabase.from('issues').select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }

    if (options.filter?.published !== undefined) {
      query = query.eq('published', options.filter.published);
    }

    const sortColumn = options.sort?.column ?? 'created_at';
    const sortOrder = options.sort?.order ?? 'desc';

    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const result = await query;

    return this.handleQueryResult(result, 'Issue');
  }

  async update(
    data: Tables<'issues'>
  ): Promise<Result<Tables<'issues'>, RepositoryError>> {
    const idResult = this.requireId(data.id, 'Issue');
    if (!idResult.success) {
      return idResult as Result<Tables<'issues'>, DatabaseError>;
    }

    const result = await this.supabase
      .from('issues')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    return this.handleSingleResult(result, 'update', 'Issue');
  }

  async delete(id: number): Promise<Result<Tables<'issues'>, RepositoryError>> {
    const result = await this.supabase
      .from('issues')
      .delete()
      .eq('id', id)
      .select()
      .single();
    return this.handleSingleResult(result, 'delete', 'Issue');
  }

  async count(
    filter?: IssueQueryOptions['filter']
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
