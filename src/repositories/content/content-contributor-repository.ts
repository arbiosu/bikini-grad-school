import { Result, success, failure } from '@/lib/common/result';
import { BaseRepository } from '@/lib/common/base-repository';
import { DatabaseError, RepositoryError } from '@/lib/common/errors';
import type {
  Tables,
  TablesInsert,
  Count,
} from '@/lib/supabase/database/types';

interface ContentContributorsQueryOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    content_id?: number;
  };
  select?: (keyof Tables<'content_contributors'>)[];
}

interface ContentContributorsQueryResult {
  data: Tables<'content_contributors'>[];
  count: number | null;
}

/**
 * Repository for ContentContributor join table operations
 * Handles linking contributors to content with their roles
 */
export class ContentContributorRepository extends BaseRepository {
  /**
   * Create multiple content-contributor relationships at once
   * This is the primary creation method since contributors are typically added in bulk
   */
  async createMany(
    data: TablesInsert<'content_contributors'>[]
  ): Promise<Result<Tables<'content_contributors'>[], RepositoryError>> {
    const result = await this.supabase
      .from('content_contributors')
      .insert(data);

    if (result.error) {
      return failure(
        this.mapSupabaseError(result.error, 'create', 'ContentContributor')
      );
    }

    if (!result.data) {
      return failure(
        new DatabaseError('No content contributors data returned', 'create')
      );
    }

    return success(result.data);
  }

  async create(
    data: TablesInsert<'content_contributors'>
  ): Promise<Result<Tables<'content_contributors'>, DatabaseError>> {
    const result = await this.createMany([data]);

    if (!result.success) {
      return result as Result<Tables<'content_contributors'>, DatabaseError>;
    }

    const contributor = result.data[0];
    if (!contributor) {
      return failure(
        new DatabaseError('No content contributor data returned', 'create')
      );
    }

    return success(contributor);
  }

  /**
   * Find all contributors for a specific content
   */
  async findByContentId(
    contentId: number
  ): Promise<Result<Tables<'content_contributors'>[], RepositoryError>> {
    const result = await this.query({
      filter: { content_id: contentId },
    });
    if (!result.success) {
      return result as Result<
        Tables<'content_contributors'>[],
        RepositoryError
      >;
    }
    const contributors = result.data.data;
    return success(contributors);
  }

  /**
   * Query all content contributors with optional filters
   */
  async query(
    options: ContentContributorsQueryOptions
  ): Promise<Result<ContentContributorsQueryResult, RepositoryError>> {
    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = this.supabase
      .from('content_contributors')
      .select(selectColumns as '*', {
        count: options.count,
        head: options.onlyCount ?? false,
      });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }
    if (options.filter?.content_id) {
      query = query.eq('content_id', options.filter.content_id);
    }

    const result = await query;
    return this.handleQueryResult(result, 'ContentContributor');
  }

  /**
   * Update/replace content contributors using upsert
   * This allows both updating existing and creating new in one operation
   */
  async upsert(
    data: Tables<'content_contributors'>[]
  ): Promise<Result<Tables<'content_contributors'>[], RepositoryError>> {
    const result = await this.supabase
      .from('content_contributors')
      .upsert(data)
      .select();

    if (result.error) {
      return failure(
        this.mapSupabaseError(result.error, 'update', 'ContentContributor')
      );
    }

    if (!result.data) {
      return failure(
        new DatabaseError(
          'No content contributors data returned from upsert',
          'update'
        )
      );
    }

    return success(result.data);
  }

  async deleteById(
    id: number
  ): Promise<Result<Tables<'content_contributors'>[], RepositoryError>> {
    const result = await this.supabase
      .from('content_contributors')
      .delete()
      .eq('id', id)
      .select();

    if (result.error) {
      return failure(
        this.mapSupabaseError(result.error, 'delete', 'ContentContributor')
      );
    }

    if (!result.data) {
      return failure(
        new DatabaseError(
          'No content contributor data returned from delete',
          'delete'
        )
      );
    }

    return success(result.data);
  }
  /**
   * Delete all contributors for a specific content
   * Useful when updating content contributors
   */
  async deleteByContentId(
    contentId: number
  ): Promise<Result<number, DatabaseError>> {
    const findResult = await this.findByContentId(contentId);
    if (!findResult.success) {
      return findResult as Result<number, DatabaseError>;
    }

    const contributors = findResult.data;

    if (contributors.length === 0) {
      return success(0); // Nothing to delete
    }

    // Delete each one
    let deletedCount = 0;
    for (const contributor of contributors) {
      const deleteResult = await this.deleteById(contributor.id);
      if (deleteResult.success) {
        deletedCount++;
      }
    }

    return success(deletedCount);
  }
}
