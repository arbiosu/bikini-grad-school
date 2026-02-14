import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path',
    '/my-account',
    '/my-account/:path*',
    '/login',
    '/claim-account',
  ],
};
