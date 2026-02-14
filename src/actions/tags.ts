'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createTagService } from '@/lib/container';
import type { CreateTagParams, UpdateTagParams } from '@/services/tag-service';
import { serializeError } from '@/lib/common/action-utils';
import type { ActionResult } from '@/lib/common/action-types';

export async function createTagAction(
  data: CreateTagParams
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const tagService = createTagService(supabase);
  const result = await tagService.createTag(data);
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

export async function updateTagAction(
  data: UpdateTagParams
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const tagService = createTagService(supabase);
  const result = await tagService.updateTag(data);
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

export async function deleteTagAction(
  id: number
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const tagService = createTagService(supabase);
  const result = await tagService.deleteTag(id);
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
