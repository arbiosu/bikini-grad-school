import { BaseHandler } from '@/lib/common/base-handler';
import type { ValidationResult } from '@/lib/common/result';
import type { ContributorData } from '../types';

export class ContributorHandler extends BaseHandler<ContributorData> {
  readonly type = 'contributor';

  validate(data: ContributorData): ValidationResult {
    const errors: string[] = [];

    const nameError = this.validateRequired(data.name, 'Name');
    if (nameError) {
      errors.push(nameError);
    }

    return this.collectErrors(errors);
  }

  transform(data: ContributorData): ContributorData {
    const transformed: ContributorData = {
      ...data,
      name: this.normalizeWhitespace(data.name),
      bio: data.bio ? this.normalizeWhitespace(data.bio) : undefined,
    };

    return transformed;
  }
}
