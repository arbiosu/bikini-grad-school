'use server';

import type {
  Tables,
  TablesInsert,
  Count,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

interface QueryTagsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
  };
  select?: (keyof Tables<'tags'>)[];
}

export async function createTag(data: TablesInsert<'tags'>) {
  const supabase = await createServiceClient();
  return await supabase.from('tags').insert(data).select().single();
}

export async function queryTags(options: QueryTagsOptions = {}) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase.from('tags').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.id) {
    query = query.eq('id', options.filter.id);
  }

  return await query;
}

export async function updateTag(data: Tables<'tags'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('tags')
    .update({ ...data })
    .eq('id', data.id)
    .select()
    .single();
}

export async function deleteTag(id: number) {
  const supabase = await createServiceClient();
  return await supabase.from('tags').delete().eq('id', id).select().single();
}
