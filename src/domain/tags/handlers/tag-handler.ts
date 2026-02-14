import { BaseHandler } from '@/lib/common/base-handler';
import { ValidationResult } from '@/lib/common/result';
import type { TagData } from '../types';

export class TagHandler extends BaseHandler<TagData> {
  readonly type = 'tag';

  validate(data: TagData): ValidationResult {
    const errors: string[] = [];

    const nameError = this.validateRequired(data.name, 'Name');
    if (nameError) {
      errors.push(nameError);
    }

    return this.collectErrors(errors);
  }

  transform(data: TagData): TagData {
    const transformed: TagData = {
      ...data,
      name: this.normalizeWhitespace(data.name),
    };
    return transformed;
  }
}
