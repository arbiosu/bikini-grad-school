'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createContributorService } from '@/lib/container';
import type {
  CreateContributorParams,
  UpdateContributorParams,
} from '@/services/contributor-service';
import { serializeError } from '@/lib/common/action-utils';
import type { ActionResult } from '@/lib/common/action-types';

export async function createContributorAction(
  data: CreateContributorParams
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const contributorService = createContributorService(supabase);
  const result = await contributorService.createContributor(data);
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

export async function updateContributorAction(
  data: UpdateContributorParams
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const contributorService = createContributorService(supabase);
  const result = await contributorService.updateContributor(data);
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

export async function deleteContributorAction(
  id: number
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const contributorService = createContributorService(supabase);
  const result = await contributorService.deleteContributor(id);
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
