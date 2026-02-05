'use server';

import type {
  Tables,
  TablesInsert,
  Count,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

interface QueryContentTagsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: {
      contentId: number;
      tagId: number;
    };
  };
  select?: (keyof Tables<'content_tags'>)[];
  limit?: number;
}

export async function createContentTag(data: TablesInsert<'content_tags'>) {
  const supabase = await createServiceClient();
  return await supabase.from('content_tags').insert(data).select().single();
}

export async function queryContentTags(options: QueryContentTagsOptions = {}) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase.from('content_tags').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.id) {
    query = query.eq('content_id', options.filter.id.contentId);
    query = query.eq('tag_id', options.filter.id.tagId);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return await query;
}

export async function deleteContentTag(contentId: number, tagId: number) {
  const supabase = await createServiceClient();
  return await supabase
    .from('content_tags')
    .delete()
    .eq('content_id', contentId)
    .eq('tag_id', tagId)
    .select()
    .single();
}
