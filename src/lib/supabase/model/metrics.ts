'use server';

import type {
  Tables,
  TablesInsert,
  Count,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

interface QueryContentMetricsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    content_id?: number;
  };
  select?: (keyof Tables<'content_metrics'>)[];
}

export async function createContentMetrics(
  data: TablesInsert<'content_metrics'>
) {
  const supabase = await createServiceClient();
  return await supabase.from('content_metrics').insert(data).select().single();
}

export async function queryContentMetrics(
  options: QueryContentMetricsOptions = {}
) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase.from('content_metrics').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.content_id) {
    query = query.eq('content_id', options.filter.content_id);
  }

  return await query;
}

export async function updateContentMetric(data: Tables<'content_metrics'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('content_metrics')
    .update({ ...data })
    .eq('id', data.id)
    .select()
    .single();
}

export async function deleteConentMetric(id: number) {
  const supabase = await createServiceClient();
  return await supabase
    .from('content_metrics')
    .delete()
    .eq('id', id)
    .select()
    .single();
}
