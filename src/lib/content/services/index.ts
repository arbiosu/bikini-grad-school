import { ContentService } from './content-service';
import { repositories } from '@/lib/content/repositories';

/**
 * Singleton instance of ContentService
 */
export const contentService = new ContentService(repositories);

// Re-export types and classes
export * from './content-service';
export { ContentService };
