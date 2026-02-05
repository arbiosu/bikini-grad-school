'use server';

import type {
  Tables,
  TablesInsert,
  Count,
  SortOrder,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

export interface ContentsQueryOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
    slug?: string;
    issueId?: number;
    excludeId?: number;
  };
  select?: (keyof Tables<'contents'>)[];
  sort?: {
    column?: keyof Tables<'contents'>;
    order: SortOrder;
  };
  limit?: number;
}

export interface CreateFullContentParams {
  content: Omit<TablesInsert<'contents'>, 'id'>;
  typeData: {
    article?: { body: string; featured_image?: string | null };
    feature?: { description: string };
    interview?: {
      interviewee_name: string;
      interviewee_bio?: string | null;
      transcript: string;
      profile_image?: string | null;
    };
  };
  contributors: Array<{
    contributor_id: number;
    role_id: number;
  }>;
}

export async function createContent(data: TablesInsert<'contents'>) {
  const supabase = await createServiceClient();
  return await supabase.from('contents').insert(data).select().single();
}

export async function createFullContent(params: CreateFullContentParams) {
  const supabase = await createServiceClient();
  const typeData =
    params.content.type === 'article'
      ? params.typeData.article
      : params.content.type === 'feature'
        ? params.typeData.feature
        : params.content.type === 'interview'
          ? params.typeData.interview
          : null;
  if (!typeData) return;
  return await supabase.rpc('create_full_content', {
    content_data: params.content,
    contributors: params.contributors,
    type_data: typeData,
  });
}

export async function queryContents(
  options: ContentsQueryOptions = { sort: { order: 'desc' } }
) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase.from('contents').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.id) {
    query = query.eq('id', options.filter.id);
  }

  if (options.filter?.published !== undefined) {
    query = query.eq('published', options.filter.published);
  }

  if (options.filter?.issueId) {
    query = query.eq('issue_id', options.filter.issueId);
  }

  if (options.filter?.slug) {
    query = query.eq('slug', options.filter.slug);
  }

  if (options.filter?.excludeId) {
    query = query.neq('id', options.filter.excludeId);
  }

  const sortColumn = options.sort?.column ?? 'created_at';
  const sortOrder = options.sort?.order ?? 'desc';

  query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return await query;
}

export async function updateContent(data: Tables<'contents'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('contents')
    .update({ ...data })
    .eq('id', data.id)
    .select()
    .single();
}

export async function deleteContent(id: number) {
  const supabase = await createServiceClient();
  return await supabase
    .from('contents')
    .delete()
    .eq('id', id)
    .select()
    .single();
}
