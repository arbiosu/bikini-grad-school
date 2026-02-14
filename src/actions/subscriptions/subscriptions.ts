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

export async function getMySubscriptionAction(): Promise<
  ActionResult<SubscriptionWithAddons>
> {
  const supabase = await createServiceClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: serializeError('User not authenticated') };
  }

  const service = createSubscriptionService(supabase);
  const result = await service.getByUserId(user.id);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  return { success: true, data: result.data };
}

// --- Cancel / Reactivate ---

export async function cancelSubscriptionAction(): Promise<ActionResult<null>> {
  const supabase = await createServiceClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: serializeError('User not authenticated') };
  }

  const service = createSubscriptionService(supabase);
  const result = await service.cancel(user.id);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: null };
}

export async function reactivateSubscriptionAction(): Promise<
  ActionResult<null>
> {
  const supabase = await createServiceClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: serializeError('User not authenticated') };
  }

  const service = createSubscriptionService(supabase);
  const result = await service.reactivate(user.id);

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: null };
}

// --- Change Tier ---

export async function changeTierAction(data: {
  newTierId: string;
  newInterval: 'month' | 'year';
  addonProductIds: string[];
}): Promise<ActionResult<SubscriptionWithAddons>> {
  const supabase = await createServiceClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: serializeError('User not authenticated') };
  }
  const service = createSubscriptionService(supabase);
  const result = await service.changeTier({
    userId: user.id,
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
  addonProductIds: string[];
}): Promise<ActionResult<SubscriptionAddonSelection[]>> {
  const supabase = await createServiceClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: serializeError('User not authenticated') };
  }

  const service = createSubscriptionService(supabase);
  const result = await service.swapAddons({ ...data, userId: user.id });

  if (!result.success) {
    return { success: false, error: serializeError(result.error) };
  }

  revalidatePath('/', 'layout');

  return { success: true, data: result.data };
}
