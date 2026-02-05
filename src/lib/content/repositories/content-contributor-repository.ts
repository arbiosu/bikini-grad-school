// lib/content/repositories/content-contributor-repository.ts

import { Result, success, failure } from '@/lib/common/result';
import { BaseRepository } from '@/lib/common/base-repository';
import { DatabaseError, RepositoryError } from '@/lib/common/errors';
import {
  createContentContributors,
  queryContentContributors,
  updateContentContributor,
  deleteContentContributor,
} from '@/lib/supabase/model/contentContributors';
import type { Tables, TablesInsert } from '@/lib/supabase/database/types';

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
    const result = await createContentContributors(data);

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

  /**
   * Create a single content-contributor relationship
   * Convenience wrapper around createMany
   */
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
    const result = await queryContentContributors({
      filter: { content_id: contentId },
    });
    if (result.error) {
      return failure(
        this.mapSupabaseError(result.error, 'read', 'ContentContributor')
      );
    }
    return success(result.data);
  }

  /**
   * Find a specific content-contributor relationship by ID
   */
  async findById(
    id: number
  ): Promise<Result<Tables<'content_contributors'>, RepositoryError>> {
    const result = await queryContentContributors({
      filter: { id },
    });

    if (result.error) {
      return failure(
        this.mapSupabaseError(result.error, 'read', 'ContentContributor')
      );
    }

    const contributor = result.data?.[0];
    if (!contributor) {
      return failure(
        new DatabaseError(`Content contributor with id ${id} not found`, 'read')
      );
    }

    return success(contributor);
  }

  /**
   * Query all content contributors with optional filters
   */
  async query(options?: {
    count?: 'exact' | 'planned' | 'estimated';
    onlyCount?: boolean;
    filter?: {
      id?: number;
      content_id?: number;
    };
  }): Promise<
    Result<
      { data: Tables<'content_contributors'>[]; count: number | null },
      RepositoryError
    >
  > {
    const result = await queryContentContributors(options);
    return this.handleQueryResult(result, 'ContentContributor');
  }

  /**
   * Update/replace content contributors using upsert
   * This allows both updating existing and creating new in one operation
   */
  async upsert(
    data: Tables<'content_contributors'>[]
  ): Promise<Result<Tables<'content_contributors'>[], RepositoryError>> {
    const result = await updateContentContributor(data);

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

  /**
   * Delete a specific content-contributor relationship
   */
  async deleteById(
    id: number
  ): Promise<Result<Tables<'content_contributors'>[], RepositoryError>> {
    const result = await deleteContentContributor(id);

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

  /**
   * Replace all contributors for a content
   * Deletes existing and creates new ones
   * Note: This is NOT atomic - consider using the service layer for transactional behavior
   */
  async replaceForContent(
    contentId: number,
    newContributors: Omit<TablesInsert<'content_contributors'>, 'content_id'>[]
  ): Promise<Result<Tables<'content_contributors'>[], RepositoryError>> {
    // Delete existing
    const deleteResult = await this.deleteByContentId(contentId);
    if (!deleteResult.success) {
      return deleteResult as Result<
        Tables<'content_contributors'>[],
        DatabaseError
      >;
    }

    // If no new contributors, return empty array
    if (newContributors.length === 0) {
      return success([]);
    }

    // Create new
    const contributorsWithContentId = newContributors.map((c) => ({
      ...c,
      content_id: contentId,
    }));

    return this.createMany(contributorsWithContentId);
  }
}
