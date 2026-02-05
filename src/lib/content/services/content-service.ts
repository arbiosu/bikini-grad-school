import { Result, success, failure } from '@/lib/common/result';
import {
  ValidationError,
  TransactionError,
  RepositoryError,
} from '@/lib/common/errors';
import {
  validateAndTransform,
  type ContentData,
  type ArticleData,
  type FeatureData,
  type InterviewData,
} from '@/lib/content/domain/handlers';
import { RepositoryFactory } from '@/lib/content/repositories';
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
}

/**
 * Full content response with all related data
 */
export interface FullContentResponse {
  content: Tables<'contents'>;
  typeData: Tables<'articles'> | Tables<'features'> | Tables<'interviews'>;
  contributors: Tables<'content_contributors'>[];
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
}

/**
 * Update content with type-specific data
 */
export interface UpdateContentWithTypeParams {
  contentId: number;
  content?: UpdateContentParams;
  typeData?: ArticleData | FeatureData | InterviewData;
  contributors?: Array<{
    contributor_id: number;
    role_id: number;
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

    // Get existing content to merge with updates
    const existingResult = await this.repos.content().findById(params.id);
    if (!existingResult.success) {
      return existingResult;
    }

    const existing = existingResult.data;

    // Merge updates with existing data
    const updatedContent: Tables<'contents'> = {
      ...existing,
      ...params,
      updated_at: new Date(Date.now()).toISOString(),
    };

    // Update in database
    const updateResult = await this.repos.content().update(updatedContent);

    if (!updateResult.success) {
      return updateResult;
    }

    // Revalidate cache

    return updateResult;
  }

  /**
   * Update content with type-specific data and/or contributors
   * Allows updating content, type data, and contributors in one operation
   * todo
   */
  async updateContentWithType(
    params: UpdateContentWithTypeParams
  ): Promise<Result<number, ValidationError | RepositoryError>> {
    const contentResult = await this.repos.content().findById(params.contentId);
    if (!contentResult.success) {
      return contentResult;
    }

    const content = contentResult.data;

    if (params.content) {
      const updateResult = await this.updateContent({
        ...params.content,
        id: params.contentId,
      });
      if (!updateResult.success) {
        return updateResult;
      }
    }

    // Update type-specific data if provided
    if (params.typeData) {
      const validationResult = validateAndTransform(
        content.type,
        params.typeData
      );

      if (!validationResult.isValid) {
        return failure(new ValidationError(validationResult.errors));
      }

      const transformedData = validationResult.transformedData!;

      // Update based on content type
      const typeRepo = this.repos.forContentType(content.type);
      const typeUpdateResult = await typeRepo.update({
        id: params.contentId,
        ...transformedData,
      } as any);

      if (!typeUpdateResult.success) {
        return typeUpdateResult;
      }
    }

    // Update contributors if provided
    if (params.contributors) {
      if (params.contributors.length === 0) {
        return failure(
          new ValidationError(['At least one contributor is required'])
        );
      }

      const replaceResult = await this.repos
        .contributor()
        .replaceForContent(params.contentId, params.contributors);

      if (!replaceResult.success) {
        return replaceResult;
      }
    }

    return success(params.contentId);
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
   * Get full content by slug with type-specific data and contributors
   */
  async getContentBySlug(
    slug: string
  ): Promise<Result<FullContentResponse, RepositoryError>> {
    // Get base content
    const contentResult = await this.repos.content().findBySlug(slug);
    if (!contentResult.success) {
      return contentResult as Result<FullContentResponse, RepositoryError>;
    }

    const content = contentResult.data;

    // Get type-specific data
    const typeRepo = this.repos.forContentType(content.type);
    const typeResult = await typeRepo.findById(content.id);
    if (!typeResult.success) {
      return typeResult as Result<FullContentResponse, RepositoryError>;
    }

    // Get contributors
    const contributorsResult = await this.repos
      .contributor()
      .findByContentId(content.id);
    if (!contributorsResult.success) {
      return contributorsResult as Result<FullContentResponse, RepositoryError>;
    }

    return success({
      content,
      typeData: typeResult.data,
      contributors: contributorsResult.data,
    });
  }

  /**
   * Get full content by ID with type-specific data and contributors
   */
  async getContentById(
    id: number
  ): Promise<Result<FullContentResponse, RepositoryError>> {
    // Get base content
    const contentResult = await this.repos.content().findById(id);
    if (!contentResult.success) {
      return contentResult as Result<FullContentResponse, RepositoryError>;
    }

    const content = contentResult.data;

    // Get type-specific data
    const typeRepo = this.repos.forContentType(content.type);
    const typeResult = await typeRepo.findById(content.id);
    if (!typeResult.success) {
      return typeResult as Result<FullContentResponse, RepositoryError>;
    }

    // Get contributors
    const contributorsResult = await this.repos
      .contributor()
      .findByContentId(content.id);
    if (!contributorsResult.success) {
      return contributorsResult as Result<FullContentResponse, RepositoryError>;
    }

    return success({
      content,
      typeData: typeResult.data,
      contributors: contributorsResult.data,
    });
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
   * List all content for admin (includes drafts)
   * todo
   */
  async listAllContent(options?: {
    limit?: number;
    issueId?: number;
  }): Promise<Result<Tables<'contents'>[], RepositoryError>> {
    const queryOptions: any = {
      limit: options?.limit,
      sort: { column: 'created_at', order: 'desc' },
    };

    if (options?.issueId) {
      queryOptions.filter = { issueId: options.issueId };
    }

    const queryResult = await this.repos.content().query(queryOptions);

    if (!queryResult.success) {
      return queryResult as Result<Tables<'contents'>[], RepositoryError>;
    }

    return success(queryResult.data.data);
  }
}

// todo find better place for this
export function isArticle(
  type: string,
  data: Tables<'articles'> | Tables<'features'> | Tables<'interviews'>
): data is Tables<'articles'> {
  return type === 'article';
}

export function isInterview(
  type: string,
  data: Tables<'articles'> | Tables<'features'> | Tables<'interviews'>
): data is Tables<'interviews'> {
  return type === 'interview';
}

export function isFeature(
  type: string,
  data: Tables<'articles'> | Tables<'features'> | Tables<'interviews'>
): data is Tables<'features'> {
  return type === 'feature';
}
