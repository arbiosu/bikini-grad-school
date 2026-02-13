'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createSubscriptionService } from '@/lib/container';
import { serializeError } from '@/lib/common/action-utils';
import type { ActionResult } from '@/lib/common/action-types';
import type {
  SubscriptionWithAddons,
  SubscriptionAddonSelection,
} from '@/domain/subscriptions/types';

// --- Checkout (unauthenticated) ---

export async function createCheckoutAction(data: {
  tierId: string;
  interval: 'month' | 'year';
  addonProductIds: string[];
  successUrl: string;
  cancelUrl: string;
}): Promise<ActionResult<{ url: string }>> {
  const supabase = await createServiceClient();
  const service = createSubscriptionService(supabase);
  const result = await service.createCheckoutSession(data);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  return { success: true, data: result.data };
}

// --- Subscription Queries (authenticated) ---
// TODO: unsecure, currently take userId as a parameter from the client. In production you'll want to get the user ID from the session server-side

export async function getMySubscriptionAction(
  userId: string
): Promise<ActionResult<SubscriptionWithAddons>> {
  const supabase = await createServiceClient();
  const service = createSubscriptionService(supabase);
  const result = await service.getByUserId(userId);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  return { success: true, data: result.data };
}

// --- Cancel / Reactivate ---

export async function cancelSubscriptionAction(
  userId: string
): Promise<ActionResult<null>> {
  const supabase = await createServiceClient();
  const service = createSubscriptionService(supabase);
  const result = await service.cancel(userId);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: null };
}

export async function reactivateSubscriptionAction(
  userId: string
): Promise<ActionResult<null>> {
  const supabase = await createServiceClient();
  const service = createSubscriptionService(supabase);
  const result = await service.reactivate(userId);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: null };
}

// --- Change Tier ---

export async function changeTierAction(data: {
  userId: string;
  newTierId: string;
  newInterval: 'month' | 'year';
  addonProductIds: string[];
}): Promise<ActionResult<SubscriptionWithAddons>> {
  const supabase = await createServiceClient();
  const service = createSubscriptionService(supabase);
  const result = await service.changeTier({
    userId: data.userId,
    newTierId: data.newTierId,
    newInterval: data.newInterval,
    addonProductIds: data.addonProductIds,
  });

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: result.data };
}

// --- Swap Addons ---

export async function swapAddonsAction(data: {
  userId: string;
  addonProductIds: string[];
}): Promise<ActionResult<SubscriptionAddonSelection[]>> {
  const supabase = await createServiceClient();
  const service = createSubscriptionService(supabase);
  const result = await service.swapAddons(data);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: result.data };
}
