import { Result, success } from '@/lib/common/result';
import { BaseRepository } from '@/lib/common/base-repository';
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
} from '@/lib/common/errors';
import {
  createArticle,
  queryArticles,
  updateArticle,
  deleteArticle,
} from '@/lib/supabase/model/articles';
import type { Tables, TablesInsert } from '@/lib/supabase/database/types';

/**
 * Repository for Article table operations
 * Handles CRUD operations for article-specific data
 */
export class ArticleRepository extends BaseRepository {
  /**
   * Create a new article
   * Note: The content record must already exist with this ID
   */
  async create(
    data: TablesInsert<'articles'>
  ): Promise<Result<Tables<'articles'>, RepositoryError>> {
    const result = await createArticle(data);
    return this.handleSingleResult(result, 'create', 'Article');
  }

  /**
   * Find article by content ID
   */
  async findById(
    id: number
  ): Promise<Result<Tables<'articles'>, DatabaseError | NotFoundError>> {
    const result = await queryArticles({ filter: { id } });

    if (result.error) {
      return this.handleQueryResult(result, 'Article') as Result<
        Tables<'articles'>,
        DatabaseError
      >;
    }

    const article = result.data?.[0];
    if (!article) {
      return this.notFound('Article', id);
    }

    return success(article);
  }

  /**
   * Query articles with optional filters
   */
  async query(options?: {
    count?: 'exact' | 'planned' | 'estimated';
    onlyCount?: boolean;
  }): Promise<
    Result<
      { data: Tables<'articles'>[]; count: number | null },
      RepositoryError
    >
  > {
    const result = await queryArticles(options);
    return this.handleQueryResult(result, 'Article');
  }

  /**
   * Update article
   */
  async update(
    data: Tables<'articles'>
  ): Promise<Result<Tables<'articles'>, RepositoryError>> {
    const idResult = this.requireId(data.id, 'Article');
    if (!idResult.success) {
      return idResult as Result<Tables<'articles'>, DatabaseError>;
    }

    const result = await updateArticle(data);
    return this.handleSingleResult(result, 'update', 'Article');
  }

  /**
   * Delete article by ID
   */
  async delete(
    id: number
  ): Promise<Result<Tables<'articles'>, RepositoryError>> {
    const result = await deleteArticle(id);
    return this.handleSingleResult(result, 'delete', 'Article');
  }
}
