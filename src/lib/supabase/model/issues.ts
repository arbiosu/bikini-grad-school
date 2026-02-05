'use server';

import type {
  Tables,
  TablesInsert,
  Count,
  SortOrder,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

export interface IssueQueryOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Tables<'issues'>)[];
  sort?: {
    column?: keyof Tables<'issues'>;
    order: SortOrder;
  };
  limit?: number;
}

export async function createIssue(data: TablesInsert<'issues'>) {
  const supabase = await createServiceClient();
  return await supabase.from('issues').insert(data).select().single();
}

export async function queryIssues(
  options: IssueQueryOptions = { sort: { order: 'desc' } }
) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase.from('issues').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.id) {
    query = query.eq('id', options.filter.id);
  }

  if (options.filter?.published !== undefined) {
    query = query.eq('published', options.filter.published);
  }

  const sortColumn = options.sort?.column ?? 'created_at';
  const sortOrder = options.sort?.order ?? 'desc';

  query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return await query;
}

export async function updateIssue(data: Tables<'issues'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('issues')
    .update({ ...data })
    .eq('id', data.id)
    .select()
    .single();
}

export async function deleteIssue(id: number) {
  const supabase = await createServiceClient();
  return await supabase.from('issues').delete().eq('id', id).select().single();
}
