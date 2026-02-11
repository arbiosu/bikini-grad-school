'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createRoleService } from '@/lib/container';
import type {
  CreateRoleParams,
  UpdateRoleParams,
} from '@/services/role-service';
import { serializeError } from '@/lib/common/action-utils';
import type { ActionResult } from '@/lib/common/action-types';

export async function createRoleAction(
  data: CreateRoleParams
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const roleService = createRoleService(supabase);
  const result = await roleService.createRole(data);
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

export async function updateRoleAction(
  data: UpdateRoleParams
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const roleService = createRoleService(supabase);
  const result = await roleService.updateRole(data);
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

export async function deleteRoleAction(
  id: number
): Promise<ActionResult<number>> {
  const supabase = await createServiceClient();
  const roleService = createRoleService(supabase);
  const result = await roleService.deleteRole(id);
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
