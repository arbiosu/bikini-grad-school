// lib/content/domain/handlers/content-handler.ts
import { BaseHandler } from '@/lib/common/base-handler';
import type { ValidationResult, ContentData } from '../types';

export class ContentHandler extends BaseHandler<ContentData> {
  readonly type = 'content';

  validate(data: ContentData): ValidationResult {
    const errors: string[] = [];

    const titleError = this.validateRequired(data.title, 'Title');
    if (titleError) {
      errors.push(titleError);
    } else {
      const titleLengthError = this.validateLength(data.title, 'Title', 1, 200);
      if (titleLengthError) {
        errors.push(titleLengthError);
      }
    }

    const slugError = this.validateRequired(data.slug, 'Slug');
    if (slugError) {
      errors.push(slugError);
    } else {
      if (!this.isValidSlug(data.slug)) {
        errors.push(
          'Slug can only contain lowercase letters, numbers, and hyphens'
        );
      }
      const slugLengthError = this.validateLength(data.slug, 'Slug', 1, 200);
      if (slugLengthError) {
        errors.push(slugLengthError);
      }
    }

    if (!data.issue_id || data.issue_id === 0) {
      errors.push('Please select a valid issue');
    }

    if (data.summary) {
      const summaryLengthError = this.validateLength(
        data.summary,
        'Summary',
        undefined,
        500
      );
      if (summaryLengthError) {
        errors.push(summaryLengthError);
      }
    }

    return this.collectErrors(errors);
  }

  transform(data: ContentData): ContentData {
    return {
      title: this.normalizeWhitespace(data.title),
      slug: data.slug.toLowerCase().trim(),
      summary: data.summary
        ? this.normalizeWhitespace(data.summary)
        : undefined,
      issue_id: data.issue_id,
      published_at: data.published_at,
      published: data.published,
      type: data.type,
    };
  }
}
