'use server';

import type {
  Tables,
  TablesInsert,
  Count,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

interface QueryContentContributorsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    content_id?: number;
  };
  select?: (keyof Tables<'content_contributors'>)[];
}

export async function createContentContributors(
  data: TablesInsert<'content_contributors'>[]
) {
  const supabase = await createServiceClient();
  return await supabase.from('content_contributors').insert(data).select();
}

export async function queryContentContributors(
  options: QueryContentContributorsOptions = { count: 'exact' }
) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase
    .from('content_contributors')
    .select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

  if (options.filter?.id) {
    query = query.eq('id', options.filter.id);
  }
  if (options.filter?.content_id) {
    query = query.eq('content_id', options.filter.content_id);
  }

  return await query;
}

export async function updateContentContributor(
  data: Tables<'content_contributors'>[]
) {
  const supabase = await createServiceClient();
  return await supabase.from('content_contributors').upsert(data).select();
}

export async function deleteContentContributor(id: number) {
  const supabase = await createServiceClient();
  return await supabase
    .from('content_contributors')
    .delete()
    .eq('id', id)
    .select();
}
