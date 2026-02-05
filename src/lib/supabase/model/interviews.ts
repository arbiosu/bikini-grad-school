'use server';

import type {
  Tables,
  TablesInsert,
  Count,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

interface QueryInterviewsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
  };
  select?: (keyof Tables<'interviews'>)[];
}

export async function createInterview(data: TablesInsert<'interviews'>) {
  const supabase = await createServiceClient();
  return await supabase.from('interviews').insert(data).select().single();
}

export async function queryInterviews(options: QueryInterviewsOptions = {}) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase.from('interviews').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.id) {
    query = query.eq('id', options.filter.id);
  }

  return await query;
}

export async function updateInterview(data: Tables<'interviews'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('interviews')
    .update({ ...data })
    .eq('id', data.id)
    .select()
    .single();
}

export async function deleteInterview(id: number) {
  const supabase = await createServiceClient();
  return await supabase
    .from('interviews')
    .delete()
    .eq('id', id)
    .select()
    .single();
}
