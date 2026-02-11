import { Result, success, failure } from '@/lib/common/result';
import {
  ValidationError,
  TransactionError,
  RepositoryError,
} from '@/lib/common/errors';
import type { ContentsQueryResult } from '@/repositories/content/content-repository';
import { validateAndTransform } from '@/domain/content/handlers';
import type {
  ContentData,
  ArticleData,
  FeatureData,
  InterviewData,
  FullContent,
} from '@/domain/content/types';
import { RepositoryFactory } from '@/repositories/content';
import type { Tables } from '@/lib/supabase/database/types';

/**
 * Parameters for creating full content
 */
export interface CreateContentParams {
  content: ContentData;
  typeData: ArticleData | FeatureData | InterviewData;
  contributors: Array<{
    contributor_id: number;
    role_id: number;
  }>;
  tags: Array<{
    tag_id: number;
  }>;
}

/**
 * Update content parameters
 */
export interface UpdateContentParams {
  id: number;
  title?: string;
  slug?: string;
  summary?: string;
  issue_id?: number;
  published_at?: string;
  published?: boolean;
  updated_at?: string;
  cover_image_url?: string;
}

/**
 * Update content with type-specific data
 */
export interface UpdateFullContentParams {
  content: UpdateContentParams;
  typeData: ArticleData | FeatureData | InterviewData;
  contributors: Array<{
    contributor_id: number;
    role_id: number;
  }>;
  tags: Array<{
    tag_id: number;
  }>;
}

/**
 * Content Service
 * Orchestrates content operations using handlers and repositories
 */
export class ContentService {
  constructor(private repos: RepositoryFactory) {}

  /**
   * Create full content with validation, type-specific data, and contributors
   * Uses transaction to ensure atomicity
   */
  async createContent(
    params: CreateContentParams
  ): Promise<
    Result<number, ValidationError | TransactionError | RepositoryError>
  > {
    const contentValidationResult = validateAndTransform(
      'content',
      params.content
    );
    if (!contentValidationResult.isValid) {
      return failure(new ValidationError(contentValidationResult.errors));
    }

    const contentTypeValidationResult = validateAndTransform(
      params.content.type,
      params.typeData
    );

    if (!contentTypeValidationResult.isValid) {
      return failure(new ValidationError(contentTypeValidationResult.errors));
    }

    const transformedData = contentValidationResult.transformedData;
    const transformedTypeData = contentTypeValidationResult.transformedData;

    if (!transformedData || !transformedTypeData) {
      return failure(new ValidationError(['Failed to tranform content data']));
    }

    // Check if slug is available in db
    const slugCheck = await this.repos
      .content()
      .isSlugAvailable(params.content.slug);
    if (!slugCheck.success) {
      return slugCheck as Result<number, RepositoryError>;
    }
    if (!slugCheck.data) {
      return failure(
        new ValidationError([`Slug "${params.content.slug}" is already in use`])
      );
    }

    if (!params.contributors || params.contributors.length === 0) {
      return failure(
        new ValidationError(['At least one contributor is required'])
      );
    }
    if (!params.tags || params.tags.length === 0) {
      return failure(new ValidationError(['At least one tag is required']));
    }

    const typeDataForTransaction =
      params.content.type === 'article'
        ? {
            article: {
              body: (transformedTypeData as ArticleData).body,
              featured_image: (transformedTypeData as ArticleData)
                .featured_image,
            },
          }
        : params.content.type === 'feature'
          ? {
              feature: {
                description: (transformedTypeData as FeatureData).description,
                image_urls: (transformedTypeData as FeatureData).image_urls,
              },
            }
          : {
              interview: {
                interviewee_name: (transformedTypeData as InterviewData)
                  .interviewee_name,
                interviewee_bio: (transformedTypeData as InterviewData)
                  .interviewee_bio,
                transcript: (transformedTypeData as InterviewData).transcript,
                profile_image: (transformedTypeData as InterviewData)
                  .profile_image,
              },
            };
    const createResult = await this.repos.content().createFullContent({
      content: transformedData,
      typeData: typeDataForTransaction,
      contributors: params.contributors,
      tags: params.tags,
    });

    if (!createResult.success) {
      return createResult;
    }
    return success(createResult.data);
  }

  /**
   * Update base content information only
   */
  async updateContent(
    params: UpdateContentParams
  ): Promise<Result<Tables<'contents'>, ValidationError | RepositoryError>> {
    // Validate slug if it's being changed
    if (params.slug) {
      const slugCheck = await this.repos
        .content()
        .isSlugAvailable(params.slug, params.id);
      if (!slugCheck.success) {
        return slugCheck as Result<Tables<'contents'>, RepositoryError>;
      }
      if (!slugCheck.data) {
        return failure(
          new ValidationError([`Slug "${params.slug}" is already in use`])
        );
      }
    }

    const existingResult = await this.repos.content().findById(params.id);
    if (!existingResult.success) {
      return existingResult;
    }

    const existing = existingResult.data;

    const updatedContent: Tables<'contents'> = {
      ...existing,
      ...params,
      updated_at: new Date(Date.now()).toISOString(),
    };

    const updateResult = await this.repos.content().update(updatedContent);

    if (!updateResult.success) {
      return updateResult;
    }

    return updateResult;
  }

  /**
   * Update content with type-specific data and/or contributors
   * Allows updating content, type data, and contributors in one operation
   * todo
   */

  async updateFullContent(
    params: UpdateFullContentParams
  ): Promise<Result<void, ValidationError | RepositoryError>> {
    const { content, typeData, contributors, tags } = params;

    if (!content.id) {
      return failure(new ValidationError(['Content ID is required']));
    }

    if (content.slug) {
      const slugCheck = await this.repos
        .content()
        .isSlugAvailable(content.slug, content.id);
      if (!slugCheck.success) {
        return slugCheck as Result<void, RepositoryError>;
      }
      if (!slugCheck.data) {
        return failure(
          new ValidationError([`Slug "${content.slug}" is already in use`])
        );
      }
    }

    if (!contributors || contributors.length === 0) {
      return failure(
        new ValidationError(['At least one contributor is required'])
      );
    }
    if (!tags || tags.length === 0) {
      return failure(new ValidationError(['At least one tag is required']));
    }

    const existingResult = await this.repos.content().findById(content.id);
    if (!existingResult.success) {
      return existingResult as Result<void, RepositoryError>;
    }

    const existing = existingResult.data;

    const contentData = {
      issue_id: content.issue_id ?? existing.issue_id,
      published: content.published ?? existing.published,
      published_at: content.published_at ?? existing.published_at,
      slug: content.slug ?? existing.slug,
      summary: content.summary ?? existing.summary,
      title: content.title ?? existing.title,
      type: existing.type,
      cover_image_url: content.cover_image_url ?? existing.cover_image_url,
    };

    const result = await this.repos.content().updateFullContent({
      id: content.id,
      content: contentData,
      contributors,
      typeData,
      tags,
    });

    if (!result.success) {
      return result;
    }

    return success(undefined);
  }

  /**
   * Delete content and all related data
   * Note: Cascading deletes should be handled by database foreign keys
   */
  async deleteContent(
    contentId: number
  ): Promise<Result<Tables<'contents'>, RepositoryError>> {
    const result = await this.repos.content().delete(contentId);

    return result;
  }
  /**
   * Get single full content by id with type, contributors, and tags
   */
  async getContentById(
    id: number
  ): Promise<Result<FullContent, RepositoryError>> {
    const result = await this.repos.content().query({
      filter: {
        id: id,
      },
      include: {
        typeData: true,
        contributors: true,
        tags: true,
      },
    });

    if (!result.success) {
      return result;
    }

    return success(result.data.data[0]);
  }

  /**
   * Get single full content by slug with type-specific data and contributors
   */
  async getContentBySlug(
    slug: string
  ): Promise<Result<FullContent, RepositoryError>> {
    const result = await this.repos.content().query({
      filter: {
        slug: slug,
      },
      include: {
        typeData: true,
        contributors: true,
        tags: true,
      },
    });

    if (!result.success) {
      return result;
    }

    return success(result.data.data[0]);
  }

  /**
   * Get many full content by issue id with type-specific data and contributors
   */
  async getContentsByIssueId(
    issueId: number
  ): Promise<Result<FullContent[], RepositoryError>> {
    const result = await this.repos.content().query({
      filter: {
        issueId: issueId,
      },
      include: {
        typeData: true,
        contributors: true,
      },
    });

    if (!result.success) {
      return result;
    }

    return success(result.data.data);
  }

  /**
   * List all published content for public display
   */
  async listPublishedContent(options?: {
    limit?: number;
    issueId?: number;
  }): Promise<Result<Tables<'contents'>[], RepositoryError>> {
    const queryResult = await this.repos.content().findPublished({
      limit: options?.limit,
      sort: { column: 'published_at', order: 'desc' },
    });

    if (!queryResult.success) {
      return queryResult as Result<Tables<'contents'>[], RepositoryError>;
    }

    return success(queryResult.data.data);
  }

  /**
   * List all content for admin with count
   *
   */
  async listAllContent(options?: {
    limit?: number;
    issueId?: number;
  }): Promise<Result<ContentsQueryResult, RepositoryError>> {
    const queryOptions: any = {
      count: 'exact',
      limit: options?.limit,
      sort: { column: 'created_at', order: 'desc' },
    };

    if (options?.issueId) {
      queryOptions.filter = { issueId: options.issueId };
    }

    const queryResult = await this.repos.content().query(queryOptions);

    if (!queryResult.success) {
      return queryResult as Result<ContentsQueryResult, RepositoryError>;
    }

    return success(queryResult.data);
  }

  async listContentStats(): Promise<Result<number[], RepositoryError>> {
    const [content, articles, features, interviews] = await Promise.all([
      this.repos.content().count(),
      this.repos.article().count(),
      this.repos.feature().count(),
      this.repos.feature().count(),
    ]);

    if (
      !content.success ||
      !articles.success ||
      !features.success ||
      !interviews.success
    ) {
      return failure(new TransactionError('failed to get content counts'));
    }

    const counts = [
      content.data,
      articles.data,
      features.data,
      interviews.data,
    ];

    return success(counts);
  }
}
