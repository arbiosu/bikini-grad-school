'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/clients/service';
import type {
  CreateContentParams,
  UpdateFullContentParams,
} from '@/services/content-service';
import { serializeError } from '@/lib/common/action-utils';
import type { ActionResult } from '@/lib/common/action-types';
import { createContentService } from '@/lib/container';

export async function createContentAction(
  data: CreateContentParams
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const contentService = createContentService(supabase);
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
  data: UpdateFullContentParams
): Promise<ActionResult<void>> {
  const supabase = await createServiceClient();
  const contentService = createContentService(supabase);
  const result = await contentService.updateFullContent(data);

  if (!result.success) {
    return {
      success: false,
      error: serializeError(result.error),
    };
  }

  revalidatePath('/', 'layout');

  return {
    success: true,
    data: undefined,
  };
}

export async function deleteContentAction(
  id: number
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const contentService = createContentService(supabase);
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
