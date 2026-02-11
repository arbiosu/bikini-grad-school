import { Result, success } from '@/lib/common/result';
import { BaseRepository } from '@/lib/common/base-repository';
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
} from '@/lib/common/errors';
import type { Tables, Count } from '@/lib/supabase/database/types';

interface ArticlesQueryOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
  };
  select?: (keyof Tables<'articles'>)[];
}

interface ArticlesQueryResult {
  data: Tables<'articles'>[];
  count: number | null;
}

export class ArticleRepository extends BaseRepository {
  async findById(
    id: number
  ): Promise<Result<Tables<'articles'>, DatabaseError | NotFoundError>> {
    const result = await this.query({ filter: { id } });

    if (!result.success) {
      return result as Result<Tables<'articles'>, DatabaseError>;
    }

    const article = result.data.data[0];
    if (!article) {
      return this.notFound('Article', id);
    }

    return success(article);
  }

  async query(
    options: ArticlesQueryOptions
  ): Promise<Result<ArticlesQueryResult, RepositoryError>> {
    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';
    let query = this.supabase.from('articles').select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }

    const result = await query;
    return this.handleQueryResult(result, 'Article');
  }

  async count(
    filter?: ArticlesQueryOptions['filter']
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
