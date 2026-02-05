'use server';

import type {
  Tables,
  TablesInsert,
  Count,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

interface QueryArticlesOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
  };
  select?: (keyof Tables<'articles'>)[];
}

export async function createArticle(data: TablesInsert<'articles'>) {
  const supabase = await createServiceClient();
  return await supabase.from('articles').insert(data).select().single();
}

export async function queryArticles(
  options: QueryArticlesOptions = { count: 'exact' }
) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';
  let query = supabase.from('articles').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.id) {
    query = query.eq('id', options.filter.id);
  }

  return await query;
}

export async function updateArticle(data: Tables<'articles'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('articles')
    .update({ ...data })
    .eq('id', data.id)
    .select()
    .single();
}

export async function deleteArticle(id: number) {
  const supabase = await createServiceClient();
  return await supabase
    .from('articles')
    .delete()
    .eq('id', id)
    .select()
    .single();
}
