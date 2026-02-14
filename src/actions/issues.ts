'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createIssueService } from '@/lib/container';
import type {
  CreateIssueParams,
  UpdateIssueParams,
} from '@/services/issue-service';
import { serializeError } from '@/lib/common/action-utils';
import type { ActionResult } from '@/lib/common/action-types';

export async function createIssueAction(
  data: CreateIssueParams
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const issueService = createIssueService(supabase);
  const result = await issueService.createIssue(data);

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

export async function updateIssueAction(
  data: UpdateIssueParams
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const issueService = createIssueService(supabase);
  const result = await issueService.updateIssue(data);

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

export async function deleteIssueAction(
  id: number
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const issueService = createIssueService(supabase);
  const result = await issueService.deleteIssue(id);

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
