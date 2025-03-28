import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database';

/**
 * Supabase client for database services, only used server side.
 * @returns
 */
export async function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}
