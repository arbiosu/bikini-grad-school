'use server';

import type {
  Tables,
  TablesInsert,
  Count,
  SortOrder,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

interface QueryContributorsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    name?: string;
    role_id?: number;
  };
  select?: (keyof Tables<'contributors'>)[];
  sort?: {
    column?: keyof Tables<'contributors'>;
    order: SortOrder;
  };
  limit?: number;
}

export async function createContributor(data: TablesInsert<'contributors'>) {
  const supabase = await createServiceClient();
  return await supabase.from('contributors').insert(data).select().single();
}

export async function queryContributor(
  options: QueryContributorsOptions = { sort: { order: 'desc' } }
) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase.from('contributors').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.id) {
    query = query.eq('id', options.filter.id);
  }
  if (options.filter?.name) {
    query = query.eq('name', options.filter.name);
  }
  if (options.filter?.role_id) {
    query = query.eq('role_id', options.filter.role_id);
  }

  const sortColumn = options.sort?.column ?? 'created_at';
  const sortOrder = options.sort?.order ?? 'desc';

  query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return await query;
}

export async function updateContributor(data: Tables<'contributors'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('contributors')
    .update({ ...data })
    .eq('id', data.id)
    .select()
    .single();
}

export async function deleteContributor(id: number) {
  const supabase = await createServiceClient();
  return await supabase
    .from('contributors')
    .delete()
    .eq('id', id)
    .select()
    .single();
}
