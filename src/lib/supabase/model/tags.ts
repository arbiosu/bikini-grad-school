'use server';

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
  data: Tables<'tags'> | null;
  error: string | null;
};

interface QueryTagsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Tables<'tags'>)[];
  sort?: {
    column?: keyof Tables<'tags'>;
    order: SortOrder;
  };
  limit?: number;
}

interface QueryTagsResult {
  data: Tables<'tags'>[] | null;
  error: string | null;
  count: number | null;
}

export async function createTag(data: TablesInsert<'tags'>): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: insertData, error } = await supabase
      .from('tags')
      .insert(data)
      .select()
      .single();
    if (error || !insertData) {
      return {
        data: null,
        error: `Failed to create tag. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    revalidatePath('/');
    return { data: insertData, error: null };
  } catch (e) {
    return {
      data: null,
      error: 'SERVER ERROR: An unexpected server error occurred. (createTag)',
    };
  }
}

export async function queryTags(
  options: QueryTagsOptions = { sort: { order: 'desc' } }
): Promise<QueryTagsResult> {
  try {
    const supabase = await createClient();

    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = supabase.from('tags').select(selectColumns as '*', {
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
      console.error('Supabase error in queryTags: ', error);
      return {
        data: null,
        error: `Failed to query roles. Code: ${error.code || 'UNKNOWN'}`,
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
      error: '[queryTags] An unexpected error occurred',
      count: null,
    };
  }
}

export async function updateTag(data: TablesInsert<'tags'>): Promise<Result> {
  try {
    if (!data.id)
      return {
        data: null,
        error: 'Cannot update this tag as no ID has been provided',
      };
    const supabase = await createServiceClient();
    const { data: updateData, error } = await supabase
      .from('tags')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    if (error || !updateData) {
      return {
        data: null,
        error: `Failed to update tag with id ${data.id}. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }

    revalidatePath('/');

    return {
      data: updateData,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      error: 'SERVER ERROR: An unexpected server error occurred. (updateTag)',
    };
  }
}

export async function deleteTag(id: number): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      return {
        data: null,
        error: `Failed to delete tag with id ${id} or the tag does not exist. Code: ${deleteError?.code || 'UNKNOWN'}`,
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
      error: 'SERVER ERROR: An unexpected server error occurred. (deleteTag)',
    };
  }
}
