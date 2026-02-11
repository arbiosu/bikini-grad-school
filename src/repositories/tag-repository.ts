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
} from '@/lib/supabase/database/types';

export interface QueryTagsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
  };
  select?: (keyof Tables<'tags'>)[];
}

export interface TagQueryResult {
  data: Tables<'tags'>[];
  count: number | null;
}

export class TagRepository extends BaseRepository {
  async create(
    data: TablesInsert<'tags'>
  ): Promise<Result<Tables<'tags'>, RepositoryError>> {
    const result = await this.supabase
      .from('tags')
      .insert(data)
      .select()
      .single();
    return this.handleSingleResult(result, 'create', 'Tag');
  }

  async findById(
    id: number
  ): Promise<Result<Tables<'tags'>, DatabaseError | NotFoundError>> {
    const result = await this.query({ filter: { id } });
    if (!result.success) {
      return result as Result<Tables<'tags'>, DatabaseError>;
    }

    const tag = result.data.data[0];
    if (!tag) {
      return this.notFound('Tag', id);
    }

    return success(tag);
  }

  async query(
    options: QueryTagsOptions = {}
  ): Promise<Result<TagQueryResult, RepositoryError>> {
    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = this.supabase.from('tags').select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }

    const result = await query;
    return this.handleQueryResult(result, 'Tag');
  }

  async update(
    data: Tables<'tags'>
  ): Promise<Result<Tables<'tags'>, RepositoryError>> {
    const idResult = this.requireId(data.id, 'Tag');
    if (!idResult.success) {
      return idResult as Result<Tables<'tags'>, DatabaseError>;
    }

    const result = await this.supabase
      .from('tags')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    return this.handleSingleResult(result, 'update', 'Tag');
  }

  async delete(id: number): Promise<Result<Tables<'tags'>, RepositoryError>> {
    const result = await this.supabase
      .from('tags')
      .delete()
      .eq('id', id)
      .select()
      .single();
    return this.handleSingleResult(result, 'delete', 'Tag');
  }

  async count(
    filter?: QueryTagsOptions['filter']
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
