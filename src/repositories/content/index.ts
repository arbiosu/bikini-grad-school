import { ContentRepository } from './content-repository';
import { ArticleRepository } from './article-repository';
import { FeatureRepository } from './feature-repository';
import { InterviewRepository } from './interview-repository';
import { ContentContributorRepository } from './content-contributor-repository';
import type { ContentType } from '@/domain/content/types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Repository factory
 * Creates and manages repository instances with dependency injection
 */
export class RepositoryFactory {
  private contentRepo: ContentRepository;
  private articleRepo: ArticleRepository;
  private featureRepo: FeatureRepository;
  private interviewRepo: InterviewRepository;
  private contentContributorRepo: ContentContributorRepository;

  constructor(supabase: SupabaseClient) {
    this.contentRepo = new ContentRepository(supabase);
    this.articleRepo = new ArticleRepository(supabase);
    this.featureRepo = new FeatureRepository(supabase);
    this.interviewRepo = new InterviewRepository(supabase);
    this.contentContributorRepo = new ContentContributorRepository(supabase);
  }

  content(): ContentRepository {
    return this.contentRepo;
  }

  article(): ArticleRepository {
    return this.articleRepo;
  }

  feature(): FeatureRepository {
    return this.featureRepo;
  }

  interview(): InterviewRepository {
    return this.interviewRepo;
  }

  contentContributor(): ContentContributorRepository {
    return this.contentContributorRepo;
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
