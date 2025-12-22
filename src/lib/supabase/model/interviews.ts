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
  data: Tables<'interviews'> | null;
  error: string | null;
};

interface QueryInterviewsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Tables<'interviews'>)[];
  sort?: {
    column?: keyof Tables<'interviews'>;
    order: SortOrder;
  };
  limit?: number;
}

interface QueryInterviewsResult {
  data: Tables<'interviews'>[] | null;
  error: string | null;
  count: number | null;
}

export async function createInterview(
  data: TablesInsert<'interviews'>
): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: insertData, error } = await supabase
      .from('interviews')
      .insert(data)
      .select()
      .single();
    if (error || !insertData) {
      return {
        data: null,
        error: `Failed to create interview. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    revalidatePath('/');
    return { data: insertData, error: null };
  } catch (e) {
    return {
      data: null,
      error:
        'SERVER ERROR: An unexpected server error occurred. (createInterview)',
    };
  }
}

export async function queryInterviews(
  options: QueryInterviewsOptions = { sort: { order: 'desc' } }
): Promise<QueryInterviewsResult> {
  try {
    const supabase = await createClient();

    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = supabase.from('interviews').select(selectColumns as '*', {
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
      console.error('Supabase error in queryInterviews: ', error);
      return {
        data: null,
        error: `Failed to query interviews. Code: ${error.code || 'UNKNOWN'}`,
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
      error: '[queryInterviews] An unexpected error occurred',
      count: null,
    };
  }
}

export async function updateInterview(
  data: TablesInsert<'interviews'>
): Promise<Result> {
  try {
    if (!data.id)
      return {
        data: null,
        error: 'Cannot update this interview as no ID has been provided',
      };
    const supabase = await createServiceClient();
    const { data: updateData, error } = await supabase
      .from('interviews')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    if (error || !updateData) {
      return {
        data: null,
        error: `Failed to update interview with id ${data.id}. Code: ${error?.code || 'UNKNOWN'}`,
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
      error:
        'SERVER ERROR: An unexpected server error occurred. (updateInterview)',
    };
  }
}

export async function deleteInterview(id: number): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('interviews')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      return {
        data: null,
        error: `Failed to delete interview with id ${id} or the contributor does not exist. Code: ${deleteError?.code || 'UNKNOWN'}`,
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
        'SERVER ERROR: An unexpected server error occurred. (deleteInterview)',
    };
  }
}
