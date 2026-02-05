/**
 * Content type identifiers
 */
export type ContentType =
  | 'content'
  | 'article'
  | 'feature'
  | 'interview'
  | 'digi_media';
/**
 * Validation result type
 */
export type ValidationResult =
  | { isValid: true; errors: [] }
  | { isValid: false; errors: string[] };

/**
 * Base interface for all content type data
 */
export interface BaseData {
  id?: number;
}

export interface ContentData extends BaseData {
  title: string;
  slug: string;
  summary?: string;
  issue_id: number;
  published_at?: string;
  published: boolean;
  type: Exclude<ContentType, 'content'>;
}

/**
 * Article domain data
 */
export interface ArticleData extends BaseData {
  body: string;
  featured_image?: string | null;
}

/**
 * Feature domain data
 */
export interface FeatureData extends BaseData {
  description: string;
}

/**
 * Interview domain data
 */
export interface InterviewData extends BaseData {
  interviewee_name: string;
  interviewee_bio?: string | null;
  transcript: string;
  profile_image?: string | null;
}

/**
 * Union of all content type data
 */
export type ContentTypeData =
  | ContentData
  | ArticleData
  | FeatureData
  | InterviewData;

/**
 * Helper to create a valid validation result
 */
export function validResult(): ValidationResult {
  return { isValid: true, errors: [] };
}

/**
 * Helper to create an invalid validation result
 */
export function invalidResult(errors: string[]): ValidationResult {
  return { isValid: false, errors };
}

/**
 * Type guard to check if data is ArticleData
 */
export function isArticleData(
  data: ArticleData | FeatureData | InterviewData
): data is ArticleData {
  return 'body' in data;
}

/**
 * Type guard to check if data is FeatureData
 */
export function isFeatureData(
  data: ArticleData | FeatureData | InterviewData
): data is FeatureData {
  return 'description' in data;
}

/**
 * Type guard to check if data is InterviewData
 */
export function isInterviewData(
  data: ArticleData | FeatureData | InterviewData
): data is InterviewData {
  return 'interviewee_name' in data;
}
