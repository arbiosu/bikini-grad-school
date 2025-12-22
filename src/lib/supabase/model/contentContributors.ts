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
  data: Tables<'content_contributors'> | null;
  error: string | null;
};

interface QueryContentContributorsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Tables<'content_contributors'>)[];
  sort?: {
    column?: keyof Tables<'content_contributors'>;
    order: SortOrder;
  };
  limit?: number;
}

interface QueryContentContributorsResult {
  data: Tables<'content_contributors'>[] | null;
  error: string | null;
  count: number | null;
}

export async function createContentContributor(
  data: TablesInsert<'content_contributors'>[]
): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: insertData, error } = await supabase
      .from('content_contributors')
      .insert(data)
      .select()
      .single();
    if (error || !insertData) {
      return {
        data: null,
        error: `Failed to create content contributor. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    revalidatePath('/');
    return { data: insertData, error: null };
  } catch (e) {
    return {
      data: null,
      error:
        'SERVER ERROR: An unexpected server error occurred. (createContentContributor)',
    };
  }
}

export async function queryContentContributors(
  options: QueryContentContributorsOptions = { sort: { order: 'desc' } }
): Promise<QueryContentContributorsResult> {
  try {
    const supabase = await createClient();

    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = supabase
      .from('content_contributors')
      .select(selectColumns as '*', {
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
      console.error('Supabase error in queryContentContributors: ', error);
      return {
        data: null,
        error: `Failed to query content contributors. Code: ${error.code || 'UNKNOWN'}`,
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
      error: '[queryContentContributors] An unexpected error occurred',
      count: null,
    };
  }
}

export async function updateContentContributor(
  data: TablesInsert<'content_contributors'>
): Promise<Result> {
  try {
    if (!data.id)
      return {
        data: null,
        error:
          'Cannot update this content contributor as no ID has been provided',
      };
    const supabase = await createServiceClient();
    const { data: updateData, error } = await supabase
      .from('content_contributors')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    if (error || !updateData) {
      return {
        data: null,
        error: `Failed to update content_contributors with id ${data.id}. Code: ${error?.code || 'UNKNOWN'}`,
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
      error: 'SERVER ERROR: An unexpected server error occurred. (updateRole)',
    };
  }
}

export async function deleteContentContributor(id: number): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('content_contributors')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      return {
        data: null,
        error: `Failed to delete content contributor with id ${id} or the contributor does not exist. Code: ${deleteError?.code || 'UNKNOWN'}`,
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
      error:
        'SERVER ERROR: An unexpected server error occurred. (deleteContentContributor)',
    };
  }
}
