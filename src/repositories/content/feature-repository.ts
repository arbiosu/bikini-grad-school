import { Result, success } from '@/lib/common/result';
import { BaseRepository } from '@/lib/common/base-repository';
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
} from '@/lib/common/errors';
import type { Tables, Count } from '@/lib/supabase/database/types';

interface FeaturesQueryOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
  };
  select?: (keyof Tables<'features'>)[];
  limit?: number;
}

interface FeaturesQueryResult {
  data: Tables<'features'>[];
  count: number | null;
}

export class FeatureRepository extends BaseRepository {
  async findById(
    id: number
  ): Promise<Result<Tables<'features'>, DatabaseError | NotFoundError>> {
    const result = await this.query({ filter: { id } });

    if (!result.success) {
      return result as Result<Tables<'features'>, DatabaseError>;
    }

    const feature = result.data.data[0];
    if (!feature) {
      return this.notFound('Feature', id);
    }

    return success(feature);
  }

  /**
   * Query features with optional filters
   */
  async query(
    options: FeaturesQueryOptions
  ): Promise<Result<FeaturesQueryResult, RepositoryError>> {
    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = this.supabase.from('features').select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }
    const result = await query;
    return this.handleQueryResult(result, 'Feature');
  }

  async count(
    filter?: FeaturesQueryOptions['filter']
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
