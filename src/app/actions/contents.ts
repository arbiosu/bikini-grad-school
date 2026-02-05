'use server';

import { revalidatePath } from 'next/cache';
import {
  contentService,
  type CreateContentParams,
  type UpdateContentWithTypeParams,
} from '@/lib/content/services';
import { serializeError } from '@/lib/common/action-utils';
import type { ActionResult } from '@/lib/common/action-types';

export async function createContentAction(
  data: CreateContentParams
): Promise<ActionResult<number>> {
  const result = await contentService.createContent(data);

  if (!result.success) {
    return {
      success: false,
      error: serializeError(result.error),
    };
  }

  revalidatePath('/', 'layout');

  return {
    success: true,
    data: result.data,
  };
}

export async function updateContentAction(
  data: UpdateContentWithTypeParams
): Promise<ActionResult<number>> {
  const result = await contentService.updateContentWithType(data);

  if (!result.success) {
    return {
      success: false,
      error: serializeError(result.error),
    };
  }

  revalidatePath('/', 'layout');

  return {
    success: true,
    data: result.data,
  };
}

export async function deleteContentAction(
  id: number
): Promise<ActionResult<number>> {
  const result = await contentService.deleteContent(id);

  if (!result.success) {
    return {
      success: false,
      error: serializeError(result.error),
    };
  }

  revalidatePath('/', 'layout');

  return {
    success: true,
    data: result.data.id,
  };
}
