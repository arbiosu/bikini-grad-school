'use server';

import type {
  Tables,
  TablesInsert,
  Count,
  SortOrder,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

interface QueryFeaturesOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
  };
  select?: (keyof Tables<'features'>)[];
  limit?: number;
}

export async function createFeature(data: TablesInsert<'features'>) {
  const supabase = await createServiceClient();
  return await supabase.from('features').insert(data).select().single();
}

export async function queryFeatures(options: QueryFeaturesOptions = {}) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase.from('features').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.id) {
    query = query.eq('id', options.filter.id);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return await query;
}

export async function updateFeature(data: Tables<'features'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('features')
    .update({ ...data })
    .eq('id', data.id)
    .select()
    .single();
}

export async function deleteFeature(id: number) {
  const supabase = await createServiceClient();
  return await supabase
    .from('features')
    .delete()
    .eq('id', id)
    .select()
    .single();
}
