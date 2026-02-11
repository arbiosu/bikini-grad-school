import { Result, success } from '@/lib/common/result';
import { BaseRepository } from '@/lib/common/base-repository';
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
} from '@/lib/common/errors';

import type { Tables, Count } from '@/lib/supabase/database/types';

interface InterviewsQueryOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
  };
  select?: (keyof Tables<'interviews'>)[];
}

interface InterviewsQueryResult {
  data: Tables<'interviews'>[];
  count: number | null;
}

export class InterviewRepository extends BaseRepository {
  async findById(
    id: number
  ): Promise<Result<Tables<'interviews'>, DatabaseError | NotFoundError>> {
    const result = await this.query({ filter: { id } });

    if (!result.success) {
      return result as Result<Tables<'interviews'>, DatabaseError>;
    }

    const interview = result.data.data[0];
    if (!interview) {
      return this.notFound('Interview', id);
    }

    return success(interview);
  }

  async query(
    options: InterviewsQueryOptions
  ): Promise<Result<InterviewsQueryResult, RepositoryError>> {
    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = this.supabase.from('interviews').select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }

    const result = await query;
    return this.handleQueryResult(result, 'Interview');
  }

  async count(
    filter?: InterviewsQueryOptions['filter']
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
