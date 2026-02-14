import { BaseHandler } from '@/lib/common/base-handler';
import { ValidationResult } from '@/lib/common/result';
import type { CreativeRoleData } from '../types';

export class CreativeRoleHandler extends BaseHandler<CreativeRoleData> {
  readonly type = 'creative_role';

  validate(data: CreativeRoleData): ValidationResult {
    const errors: string[] = [];

    const nameError = this.validateRequired(data.name, 'Name');
    if (nameError) {
      errors.push(nameError);
    }

    return this.collectErrors(errors);
  }

  transform(data: CreativeRoleData): CreativeRoleData {
    const transformed: CreativeRoleData = {
      ...data,
      name: this.normalizeWhitespace(data.name),
    };
    return transformed;
  }
}
