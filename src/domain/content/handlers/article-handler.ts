import { BaseHandler } from '@/lib/common/base-handler';
import type { ValidationResult } from '@/lib/common/result';
import type { ArticleData } from '../types';

/**
 * Handler for Article content type
 * PURE - no database calls, no side effects, fully synchronous
 *
 * Business Rules:
 * - Body must be at least 50 characters
 * - Featured image must be a valid URL (if provided)
 * - Markdown must be well-formed
 */
export class ArticleHandler extends BaseHandler<ArticleData> {
  readonly type = 'article';

  // Constants for validation rules
  private readonly MIN_BODY_LENGTH = 50;
  private readonly MAX_BODY_LENGTH = 100000; // ~100KB of text

  /**
   * Validate article data according to business rules
   */
  validate(data: ArticleData): ValidationResult {
    const errors: string[] = [];

    // Validate body
    const bodyError = this.validateRequired(data.body, 'Article body');
    if (bodyError) {
      errors.push(bodyError);
    }
    const lengthError = this.validateLength(
      data.body,
      'Article body',
      this.MIN_BODY_LENGTH,
      this.MAX_BODY_LENGTH
    );
    if (lengthError) {
      errors.push(lengthError);
    }

    // Validate featured image URL if provided
    if (data.featured_image) {
      if (!this.isValidUrl(data.featured_image)) {
        errors.push('Featured image must be a valid URL');
      }
    }

    // Additional markdown validation
    const markdownErrors = this.validateMarkdownStructure(data.body || '');
    errors.push(...markdownErrors);

    return this.collectErrors(errors);
  }

  /**
   * Transform/normalize article data
   */
  transform(data: ArticleData): ArticleData {
    return {
      ...data,
      body: this.normalizeBody(data.body),
      featured_image: data.featured_image
        ? this.normalizeUrl(data.featured_image)
        : null,
    };
  }

  /**
   * Normalize article body
   * - Trim leading/trailing whitespace
   * - Normalize line endings to \n
   * - Remove excessive blank lines (more than 2 consecutive)
   */
  private normalizeBody(body: string): string {
    return body
      .trim()
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines
  }

  /**
   * Validate markdown structure
   * Checks for common markdown issues
   */
  validateMarkdownStructure(body: string): string[] {
    const warnings: string[] = [];
    // todo: implement

    return warnings;
  }

  /**
   * Extract headings from markdown
   * Useful for generating table of contents
   */
  extractHeadings(body: string): Array<{ level: number; text: string }> {
    const headings: Array<{ level: number; text: string }> = [];
    const lines = body.split('\n');

    for (const line of lines) {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        headings.push({ level, text });
      }
    }

    return headings;
  }

  /**
   * Calculate estimated reading time in minutes
   * Based on average reading speed of 200 words per minute
   */
  calculateReadingTime(body: string): number {
    const wordsPerMinute = 200;
    const words = body.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  }

  /**
   * Extract first paragraph for preview/excerpt
   */
  extractExcerpt(body: string, maxLength: number = 200): string {
    // Remove markdown formatting
    const plainText = body
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
      .replace(/`(.+?)`/g, '$1') // Remove inline code
      .trim();

    // Get first paragraph
    const firstParagraph = plainText.split('\n\n')[0] || '';

    // Truncate to maxLength
    if (firstParagraph.length <= maxLength) {
      return firstParagraph;
    }

    const truncated = firstParagraph.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  }

  /**
   * Count words in article
   */
  countWords(body: string): number {
    return body.trim().split(/\s+/).length;
  }

  /**
   * Validate that article has substantial content
   * Useful for quality checks before publishing
   */
  hasSubstantialContent(body: string): {
    hasContent: boolean;
    wordCount: number;
    reasons: string[];
  } {
    const reasons: string[] = [];
    const wordCount = this.countWords(body);
    const minWords = 100;

    if (wordCount < minWords) {
      reasons.push(
        `Article has only ${wordCount} words (minimum: ${minWords})`
      );
    }

    const headings = this.extractHeadings(body);
    if (headings.length === 0) {
      reasons.push('Article has no headings - consider adding structure');
    }

    const paragraphs = body.split('\n\n').filter((p) => p.trim().length > 0);
    if (paragraphs.length < 3) {
      reasons.push('Article has fewer than 3 paragraphs');
    }

    return {
      hasContent: reasons.length === 0,
      wordCount,
      reasons,
    };
  }
}
