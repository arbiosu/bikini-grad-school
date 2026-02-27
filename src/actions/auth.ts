'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createSubscriptionService } from '@/lib/container';
import type { ActionResult } from '@/lib/common/action-types';

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function loginAction(
  email: string,
  password: string
): Promise<ActionResult<null>> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message:
          error.message === 'Invalid login credentials'
            ? 'Invalid email or password'
            : error.message,
      },
    };
  }

  redirect('/my-account');
}

export async function generateNewMagicLinkAction(
  email: string
): Promise<ActionResult<null>> {
  const supabase = await createServiceClient();
  const service = createSubscriptionService(supabase);

  const result = await service.resendClaimLink(email);
  if (!result.success) {
    return {
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: result.error.message,
      },
    };
  }
  return { success: true, data: null };
}
