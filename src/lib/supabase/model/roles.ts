'use server';

import type {
  Tables,
  TablesInsert,
  Count,
  SortOrder,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

interface QueryRolesOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    name?: string;
  };
  select?: (keyof Tables<'creative_roles'>)[];
  sort?: {
    column?: keyof Tables<'creative_roles'>;
    order: SortOrder;
  };
  limit?: number;
}

export async function createRole(data: TablesInsert<'creative_roles'>) {
  const supabase = await createServiceClient();
  return await supabase.from('creative_roles').insert(data).select().single();
}

export async function queryRoles(
  options: QueryRolesOptions = { sort: { order: 'desc' } }
) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase.from('creative_roles').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.id) {
    query = query.eq('id', options.filter.id);
  }
  if (options.filter?.name) {
    query = query.eq('name', options.filter.name);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return await query;
}

export async function updateRole(data: Tables<'creative_roles'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('creative_roles')
    .update({ ...data })
    .eq('id', data.id)
    .select()
    .single();
}

export async function deleteRole(id: number) {
  const supabase = await createServiceClient();
  return await supabase
    .from('creative_roles')
    .delete()
    .eq('id', id)
    .select()
    .single();
}
