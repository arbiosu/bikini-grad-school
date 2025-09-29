import { revalidatePath } from 'next/cache';
import type {
  Tables,
  TablesInsert,
  Count,
  SortOrder,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

type Result = {
  data: Tables<'content_tags'> | null;
  error: string | null;
};

interface QueryContentTagsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Tables<'content_tags'>)[];
  sort?: {
    column?: keyof Tables<'content_tags'>;
    order: SortOrder;
  };
  limit?: number;
}

interface QueryContentTagsResult {
  data: Tables<'content_tags'>[] | null;
  error: string | null;
  count: number | null;
}

export async function createContentTag(
  data: TablesInsert<'content_tags'>
): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: insertData, error } = await supabase
      .from('content_tags')
      .insert(data)
      .select()
      .single();
    if (error || !insertData) {
      return {
        data: null,
        error: `Failed to create content tag. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    revalidatePath('/');
    return { data: insertData, error: null };
  } catch (e) {
    return {
      data: null,
      error:
        'SERVER ERROR: An unexpected server error occurred. (createContentTag)',
    };
  }
}

export async function queryContentTags(
  options: QueryContentTagsOptions = { sort: { order: 'desc' } }
): Promise<QueryContentTagsResult> {
  try {
    const supabase = await createClient();

    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = supabase.from('content_tags').select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }

    const sortColumn = options.sort?.column ?? 'created_at';
    const sortOrder = options.sort?.order ?? 'desc';

    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error('Supabase error in queryContentTags: ', error);
      return {
        data: null,
        error: `Failed to query content tag. Code: ${error.code || 'UNKNOWN'}`,
        count: null,
      };
    }

    return {
      data: data,
      error: null,
      count: count,
    };
  } catch (e) {
    return {
      data: null,
      error: '[queryContentTags] An unexpected error occurred',
      count: null,
    };
  }
}

export async function deleteContentTag(
  contentId: number,
  tagId: number
): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('content_tags')
      .delete()
      .eq('content_id', contentId)
      .eq('tag_id', tagId)
      .select()
      .single();
    if (deleteError || !deletedData) {
      return {
        data: null,
        error: `Failed to delete content tag with id ${contentId}:${tagId} or the contributor does not exist. Code: ${deleteError?.code || 'UNKNOWN'}`,
      };
    }

    revalidatePath('/');

    return {
      data: deletedData,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: 'SERVER ERROR: An unexpected server error occurred. (deleteRole)',
    };
  }
}
