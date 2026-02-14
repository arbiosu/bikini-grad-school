import { BaseHandler } from '@/lib/common/base-handler';
import type { ValidationResult } from '@/lib/common/result';
import { IssueData } from '../types';

export class IssueHandler extends BaseHandler<IssueData> {
  readonly type = 'issue';

  validate(data: IssueData): ValidationResult {
    const errors: string[] = [];

    if (!data.title.trim()) {
      errors.push('Title is required');
    }
    if (!data.issue_number.trim()) {
      errors.push('Issue Number is required');
    }

    return this.collectErrors(errors);
  }

  transform(data: IssueData): IssueData {
    return {
      ...data,
      title: this.normalizeWhitespace(data.title),
      issue_number: data.issue_number.trim(),
    };
  }
}
