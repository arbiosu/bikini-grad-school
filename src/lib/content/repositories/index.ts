// lib/content/repositories/index.ts

import { ContentRepository } from './content-repository';
import { ArticleRepository } from './article-repository';
import { FeatureRepository } from './feature-repository';
import { InterviewRepository } from './interview-repository';
import { ContentContributorRepository } from './content-contributor-repository';
import type { ContentType } from '../domain/types';

/**
 * Repository factory
 * Creates and manages repository instances with dependency injection
 */
export class RepositoryFactory {
  private contentRepo: ContentRepository;
  private articleRepo: ArticleRepository;
  private featureRepo: FeatureRepository;
  private interviewRepo: InterviewRepository;
  private contributorRepo: ContentContributorRepository;

  constructor() {
    this.contentRepo = new ContentRepository();
    this.articleRepo = new ArticleRepository();
    this.featureRepo = new FeatureRepository();
    this.interviewRepo = new InterviewRepository();
    this.contributorRepo = new ContentContributorRepository();
  }

  /**
   * Get the content repository
   */
  content(): ContentRepository {
    return this.contentRepo;
  }

  /**
   * Get the article repository
   */
  article(): ArticleRepository {
    return this.articleRepo;
  }

  /**
   * Get the feature repository
   */
  feature(): FeatureRepository {
    return this.featureRepo;
  }

  /**
   * Get the interview repository
   */
  interview(): InterviewRepository {
    return this.interviewRepo;
  }

  /**
   * Get the content contributor repository
   */
  contributor(): ContentContributorRepository {
    return this.contributorRepo;
  }

  /**
   * Get the appropriate type-specific repository based on content type
   * Dynamically returns the correct repository for the content type
   */
  forContentType(
    type: ContentType
  ): ArticleRepository | FeatureRepository | InterviewRepository {
    switch (type) {
      case 'article':
        return this.articleRepo;
      case 'feature':
        return this.featureRepo;
      case 'interview':
        return this.interviewRepo;
      default:
        throw new Error(`Unknown content type: ${type}`);
    }
  }
}

/**
 * Singleton instance of the repository factory
 * Use this throughout your application
 *
 * @example
 * import { repositories } from '@/lib/content/repositories';
 *
 * const result = await repositories.content().findById(123);
 * const articles = await repositories.article().query();
 */
export const repositories = new RepositoryFactory();

// Re-export everything for convenience
export * from '../../common/base-repository';
export * from './content-repository';
export * from './article-repository';
export * from './feature-repository';
export * from './interview-repository';
export * from './content-contributor-repository';
