// src/repos/content/content-repo
import { Result, success, failure } from '@/lib/common/result';
import { BaseRepository } from '@/lib/common/base-repository';
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
  TransactionError,
} from '@/lib/common/errors';
import type {
  ArticleData,
  FeatureData,
  InterviewData,
  FullContent,
} from '@/domain/content/types';
import type {
  Tables,
  TablesInsert,
  Count,
  SortOrder,
} from '@/lib/supabase/database/types';

export interface ContentsQueryOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
    slug?: string;
    issueId?: number;
    excludeId?: number;
    type?: string;
  };
  select?: (keyof Tables<'contents'>)[];
  include?: {
    typeData?: boolean;
    contributors?: boolean;
    tags?: boolean;
  };
  sort?: {
    column?: keyof Tables<'contents'>;
    order: SortOrder;
  };
  limit?: number;
}

/**
 * Query result with data and optional count
 */
export interface ContentsQueryResult {
  data: FullContent[];
  count: number | null;
}

export interface CreateFullContentParams {
  content: Omit<TablesInsert<'contents'>, 'id'>;
  typeData: {
    article?: { body: string; featured_image?: string | null };
    feature?: { description: string };
    interview?: {
      interviewee_name: string;
      interviewee_bio?: string | null;
      transcript: string;
      profile_image?: string | null;
    };
  };
  contributors: Array<{
    contributor_id: number;
    role_id: number;
  }>;
  tags: Array<{
    tag_id: number;
  }>;
}

export interface UpdateFullContentParams {
  id: number;
  content: TablesInsert<'contents'>;
  typeData: ArticleData | FeatureData | InterviewData;
  contributors: Array<{
    contributor_id: number;
    role_id: number;
  }>;
  tags: Array<{
    tag_id: number;
  }>;
}

export class ContentRepository extends BaseRepository {
  /**
   * Create a new content record
   * Note: This only creates the base content. For full content with type-specific
   * data and contributors, use createFullContent()
   */
  async create(
    data: TablesInsert<'contents'>
  ): Promise<Result<Tables<'contents'>, RepositoryError>> {
    const result = await this.supabase
      .from('contents')
      .insert(data)
      .select()
      .single();
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

    const result = await this.supabase.rpc('create_full_content', {
      content_data: params.content,
      content_tags: params.tags,
      contributors: params.contributors,
      type_data: typeData,
    });

    if (!result) {
      return failure(new TransactionError(`Failed to create full content`));
    }
    return this.handleSingleResult(result, 'create', 'Full Content');
  }

  async updateFullContent(
    params: UpdateFullContentParams
  ): Promise<Result<void, RepositoryError>> {
    const result = await this.supabase.rpc('update_full_content', {
      p_content_id: params.id,
      content_data: params.content,
      content_tags: params.tags,
      contributors: params.contributors,
      type_data: params.typeData,
    });

    if (!result) {
      return failure(new TransactionError(`Failed to update full content`));
    }

    return this.handleSingleResult(result, 'update', 'Full Content');
  }

  /**
   * Query contents with flexible options
   */

  async query(
    options: ContentsQueryOptions = { sort: { order: 'desc' } }
  ): Promise<Result<ContentsQueryResult, RepositoryError>> {
    const baseColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    const relations: string[] = [];
    if (options.include?.typeData) {
      relations.push('articles(*)', 'features(*)', 'interviews(*)');
    }
    if (options.include?.contributors) {
      relations.push('content_contributors(*)!content_id');
    }
    if (options.include?.tags) {
      relations.push('content_tags(*, tags(*))!content_id');
    }

    const selectColumns = relations.length
      ? `${baseColumns}, ${relations.join(', ')}`
      : baseColumns;

    let query = this.supabase.from('contents').select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }

    if (options.filter?.published !== undefined) {
      query = query.eq('published', options.filter.published);
    }

    if (options.filter?.issueId) {
      query = query.eq('issue_id', options.filter.issueId);
    }

    if (options.filter?.slug) {
      query = query.eq('slug', options.filter.slug);
    }

    if (options.filter?.excludeId) {
      query = query.neq('id', options.filter.excludeId);
    }

    if (options.filter?.type) {
      query = query.eq('type', options.filter.type);
    }

    const sortColumn = options.sort?.column ?? 'created_at';
    const sortOrder = options.sort?.order ?? 'desc';

    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const result = await query;
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
  ): Promise<Result<ContentsQueryResult, RepositoryError>> {
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
  ): Promise<Result<ContentsQueryResult, RepositoryError>> {
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

    const result = await this.supabase
      .from('contents')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();

    return this.handleSingleResult(result, 'update', 'Content');
  }

  /**
   * Delete content by ID
   */
  async delete(
    id: number
  ): Promise<Result<Tables<'contents'>, RepositoryError>> {
    const result = await this.supabase
      .from('contents')
      .delete()
      .eq('id', id)
      .select()
      .single();
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
   * Check if slug is available
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
