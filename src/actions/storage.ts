'use server';

import { createStorageService } from '@/lib/container';
import { serializeError } from '@/lib/common/action-utils';
import type { ActionResult } from '@/lib/common/action-types';
import type {
  FileUpload,
  PresignedUpload,
  ListObjectsResult,
} from '@/domain/storage/types';

export async function getUploadUrlAction(
  data: FileUpload
): Promise<ActionResult<PresignedUpload>> {
  const service = createStorageService();
  const result = await service.getPresignedUploadUrl(data);

  if (!result.success) {
    return {
      success: false,
      error: serializeError(result.error),
    };
  }

  return { success: true, data: result.data };
}

export async function getImagesFromFolder(
  folder: string
): Promise<ActionResult<ListObjectsResult[]>> {
  const service = createStorageService();
  const result = await service.getObjectsInFolder(folder);

  if (!result.success) {
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
  const service = createStorageService();
  const result = await service.delete(url);

  if (!result.success) {
    return {
      success: false,
      error: serializeError(result.error),
    };
  }

  return { success: true, data: result.data };
}
