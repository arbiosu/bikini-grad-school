import { BaseHandler } from '@/lib/common/base-handler';
import type { ValidationResult } from '@/lib/content/domain/types';
import type { FileUpload } from '../types';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export class StorageHandler extends BaseHandler<FileUpload> {
  readonly type = 'storage';

  validate(upload: FileUpload): ValidationResult {
    const errors: string[] = [];

    if (!ALLOWED_TYPES.includes(upload.contentType)) {
      errors.push(`File type not allowed. Use: ${ALLOWED_TYPES.join(', ')}`);
    }

    if (upload.size > MAX_SIZE_BYTES) {
      errors.push('File size must be under 10MB');
    }

    return this.collectErrors(errors);
  }
  // todo
  transform(data: FileUpload): FileUpload {
    return data;
  }

  generateKey(upload: FileUpload): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = upload.filename.split('.').pop();

    return `${upload.folder}/${timestamp}-${random}.${ext}`;
  }
}
