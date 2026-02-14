import type { Tables } from '@/lib/supabase/database/types';

export interface FullContent extends Tables<'contents'> {
  articles: Tables<'articles'> | null;
  features: Tables<'features'> | null;
  interviews: Tables<'interviews'> | null;
  content_contributors: Tables<'content_contributors'>[] | null;
  content_tags: Tables<'content_tags'>[] | null;
}

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
  cover_image_url: string | null;
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
  image_urls: string[];
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
