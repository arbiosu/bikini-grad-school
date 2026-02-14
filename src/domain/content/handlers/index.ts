import { HandlerRegistry } from '@/lib/common/base-handler';
import { ContentHandler } from './content-handler';
import { ArticleHandler } from './article-handler';
import { FeatureHandler } from './feature-handler';
import { InterviewHandler } from './interview-handler';
import type { ContentType, ContentTypeData } from '../types';
import type { ValidationResult } from '@/lib/common/result';

/**
 * Singleton registry instance with all handlers registered
 */
export const contentHandlers = new HandlerRegistry();

// Register all handlers
contentHandlers.register(new ContentHandler());
contentHandlers.register(new ArticleHandler());
contentHandlers.register(new FeatureHandler());
contentHandlers.register(new InterviewHandler());

/**
 * Type guard to check if a string is a valid content type
 */
export function isValidContentType(type: string): type is ContentType {
  return contentHandlers.has(type);
}

/**
 * Get a handler for a specific content type
 * Throws error if type is invalid
 */
export function getHandler(type: ContentType) {
  return contentHandlers.getOrThrow(type);
}

/**
 * Get all registered content types
 */
export function getAvailableContentTypes(): ContentType[] {
  return contentHandlers.getAllTypes() as ContentType[];
}

/**
 * Validate content data for a specific type
 * Returns validation result
 */
export function validateContentData(
  type: ContentType,
  data: ContentTypeData
): ValidationResult {
  const handler = getHandler(type);
  return handler.validate(data);
}

/**
 * Transform content data for a specific type
 * Returns normalized/transformed data
 */
export function transformContentData<T extends ContentTypeData>(
  type: ContentType,
  data: T
): T {
  const handler = getHandler(type);
  return handler.transform(data) as T;
}

/**
 * Validate and transform in one operation
 * Returns result with either transformed data or validation errors
 */
export function validateAndTransform<T extends ContentTypeData>(
  type: ContentType,
  data: T
): ValidationResult & { transformedData?: T } {
  const validation = validateContentData(type, data);

  if (!validation.isValid) {
    return validation;
  }

  const transformed = transformContentData(type, data);

  return {
    ...validation,
    transformedData: transformed,
  };
}
