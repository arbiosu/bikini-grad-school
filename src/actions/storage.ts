'use server';

import { createStorageService } from '@/lib/container';
import { serializeError } from '@/lib/common/action-utils';
import type { ActionResult } from '@/lib/common/action-types';
import type { FileUpload, PresignedUpload } from '@/domain/storage/types';

export async function getUploadUrlAction(
  data: FileUpload
): Promise<ActionResult<PresignedUpload>> {
  const storageService = createStorageService();
  const result = await storageService.getPresignedUploadUrl(data);

  if (!result.success) {
    console.log(result.error);
    return {
      success: false,
      error: serializeError(result.error),
    };
  }

  return { success: true, data: result.data };
}

export async function deleteImageAction(
  url: string
): Promise<ActionResult<void>> {
  const storageService = createStorageService();
  const result = await storageService.delete(url);

  if (!result.success) {
    return {
      success: false,
      error: serializeError(result.error),
    };
  }

  return { success: true, data: result.data };
}
