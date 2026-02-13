'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createClient } from '@/lib/supabase/clients/server';
import { createTierService, createAddonProductService } from '@/lib/container';
import { serializeError } from '@/lib/common/action-utils';
import type { ActionResult } from '@/lib/common/action-types';
import type {
  TierWithPrices,
  AddonProduct,
  CreateTierDTO,
  UpdateTierDTO,
  CreateAddonProductDTO,
  UpdateAddonProductDTO,
} from '@/domain/subscriptions/types';

// --- Public: List active tiers and addons ---

export async function listActiveTiersAction(): Promise<
  ActionResult<TierWithPrices[]>
> {
  const supabase = await createClient();
  const service = createTierService(supabase);
  const result = await service.list(true);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  return { success: true, data: result.data };
}

export async function listActiveAddonsAction(): Promise<
  ActionResult<AddonProduct[]>
> {
  const supabase = await createClient();
  const service = createAddonProductService(supabase);
  const result = await service.list(true);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  return { success: true, data: result.data };
}

// --- Admin: Tier Management ---

export async function createTierAction(
  data: CreateTierDTO
): Promise<ActionResult<TierWithPrices>> {
  const supabase = await createServiceClient();
  const service = createTierService(supabase);
  const result = await service.create(data);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: result.data };
}

export async function updateTierAction(
  id: string,
  data: UpdateTierDTO
): Promise<ActionResult<TierWithPrices>> {
  const supabase = await createServiceClient();
  const service = createTierService(supabase);
  const result = await service.update(id, data);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: result.data };
}

export async function deactivateTierAction(
  id: string
): Promise<ActionResult<null>> {
  const supabase = await createServiceClient();
  const service = createTierService(supabase);
  const result = await service.deactivate(id);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: null };
}

// --- Admin: Addon Product Management ---

export async function createAddonAction(
  data: CreateAddonProductDTO
): Promise<ActionResult<AddonProduct>> {
  const supabase = await createServiceClient();
  const service = createAddonProductService(supabase);
  const result = await service.create(data);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: result.data };
}

export async function updateAddonAction(
  id: string,
  data: UpdateAddonProductDTO
): Promise<ActionResult<AddonProduct>> {
  const supabase = await createServiceClient();
  const service = createAddonProductService(supabase);
  const result = await service.update(id, data);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: result.data };
}

export async function deactivateAddonAction(
  id: string
): Promise<ActionResult<null>> {
  const supabase = await createServiceClient();
  const service = createAddonProductService(supabase);
  const result = await service.deactivate(id);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: null };
}
