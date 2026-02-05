// lib/content/repositories/content-repository.ts

import { Result, success, failure } from '@/lib/common/result';
import { BaseRepository } from '@/lib/common/base-repository';
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
  TransactionError,
} from '@/lib/common/errors';
import {
  createContent,
  createFullContent,
  queryContents,
  updateContent,
  deleteContent,
  type ContentsQueryOptions,
  type CreateFullContentParams,
} from '@/lib/supabase/model/contents';
import type { Tables, TablesInsert } from '@/lib/supabase/database/types';

/**
 * Query result with data and optional count
 */
export interface ContentQueryResult {
  data: Tables<'contents'>[];
  count: number | null;
}

/**
 * Repository for Content table operations
 * Handles base content CRUD and full content creation transaction
 */
export class ContentRepository extends BaseRepository {
  /**
   * Create a new content record
   * Note: This only creates the base content. For full content with type-specific
   * data and contributors, use createFullContent()
   */
  async create(
    data: TablesInsert<'contents'>
  ): Promise<Result<Tables<'contents'>, RepositoryError>> {
    const result = await createContent(data);
    return this.handleSingleResult(result, 'create', 'Content');
  }

  /**
   * Create full content with type-specific data and contributors in a transaction
   * Uses the create_full_content RPC function
   *
   * @param params - Content data, type-specific data, and contributors
   * @returns Result with the created content ID
   */
  async createFullContent(
    params: CreateFullContentParams
  ): Promise<Result<number, RepositoryError>> {
    const typeData =
      params.content.type === 'article'
        ? params.typeData.article
        : params.content.type === 'feature'
          ? params.typeData.feature
          : params.content.type === 'interview'
            ? params.typeData.interview
            : null;

    if (!typeData) {
      return failure(
        new TransactionError(
          `No type data provided for content type: ${params.content.type}`
        )
      );
    }
    const result = await createFullContent(params);
    if (!result) {
      return failure(new TransactionError(`Failed to create full content`));
    }
    return this.handleSingleResult(result, 'create', 'Full Content');
  }

  /**
   * Query contents with flexible options
   */
  async query(
    options?: ContentsQueryOptions
  ): Promise<Result<ContentQueryResult, RepositoryError>> {
    const result = await queryContents(options);
    return this.handleQueryResult(result, 'Content');
  }

  /**
   * Find content by ID
   */
  async findById(
    id: number
  ): Promise<Result<Tables<'contents'>, DatabaseError | NotFoundError>> {
    const result = await this.query({
      filter: { id },
      limit: 1,
    });

    if (!result.success) {
      return result as Result<Tables<'contents'>, DatabaseError>;
    }

    const content = result.data.data[0];
    if (!content) {
      return this.notFound('Content', id);
    }

    return success(content);
  }

  /**
   * Find content by slug
   */
  async findBySlug(
    slug: string
  ): Promise<Result<Tables<'contents'>, DatabaseError | NotFoundError>> {
    const result = await this.query({
      filter: { slug },
      limit: 1,
    });

    if (!result.success) {
      return result as Result<Tables<'contents'>, DatabaseError>;
    }

    const content = result.data.data[0];
    if (!content) {
      return this.notFound('Content', slug);
    }

    return success(content);
  }

  /**
   * Find all published content
   */
  async findPublished(
    options?: Omit<ContentsQueryOptions, 'filter'>
  ): Promise<Result<ContentQueryResult, RepositoryError>> {
    return this.query({
      ...options,
      filter: { published: true },
    });
  }

  /**
   * Find all content by issue ID
   */
  async findByIssueId(
    issueId: number,
    options?: Omit<ContentsQueryOptions, 'filter'>
  ): Promise<Result<ContentQueryResult, RepositoryError>> {
    return this.query({
      ...options,
      filter: { issueId },
    });
  }

  /**
   * Update content
   */
  async update(
    data: Tables<'contents'>
  ): Promise<Result<Tables<'contents'>, RepositoryError>> {
    const idResult = this.requireId(data.id, 'Content');
    if (!idResult.success) {
      return idResult as Result<Tables<'contents'>, DatabaseError>;
    }

    const result = await updateContent(data);
    return this.handleSingleResult(result, 'update', 'Content');
  }

  /**
   * Delete content by ID
   */
  async delete(
    id: number
  ): Promise<Result<Tables<'contents'>, RepositoryError>> {
    const result = await deleteContent(id);
    return this.handleSingleResult(result, 'delete', 'Content');
  }

  /**
   * Count total contents
   */
  async count(
    filter?: ContentsQueryOptions['filter']
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

  /**
   * Check if slug is available (not already used)
   */
  async isSlugAvailable(
    slug: string,
    excludeId?: number
  ): Promise<Result<boolean, RepositoryError>> {
    const result = await this.query({
      count: 'exact',
      filter: {
        slug: slug,
        excludeId: excludeId,
      },
    });
    if (!result.success) {
      return result;
    }
    return success(result.data.count === 0);
  }
}
