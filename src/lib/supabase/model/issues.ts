import { revalidatePath } from 'next/cache';
import type { Tables, TablesInsert } from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

export type Count = 'exact' | 'planned' | 'estimated';
export type SortOrder = 'asc' | 'desc';

type Result = {
  data: Tables<'issues'> | null;
  error: string | null;
};

interface QueryIssuesOptions {
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

interface QueryIssuesResult {
  data: Tables<'issues'>[] | null;
  error: string | null;
  count: number | null;
}

export async function createIssue(
  data: TablesInsert<'issues'>
): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: issueInsertData, error } = await supabase
      .from('issues')
      .insert(data)
      .select()
      .single();
    if (error || !issueInsertData) {
      return {
        data: null,
        error: `Failed to create issue. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    revalidatePath('/');
    return { data: issueInsertData, error: null };
  } catch (e) {
    return {
      data: null,
      error: 'SERVER ERROR: An unexpected server error occurred. (createIssue)',
    };
  }
}

export async function queryIssues(
  options: QueryIssuesOptions = { sort: { order: 'desc' } }
): Promise<QueryIssuesResult> {
  try {
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

    const { data, error, count } = await query;
    if (error) {
      console.error('Supabase error in queryIssues: ', error);
      return {
        data: null,
        error: `Failed to query issues. Code: ${error.code || 'UNKNOWN'}`,
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
      error: '[queryIssues] An unexpected error occurred',
      count: null,
    };
  }
}

export async function updateIssue(
  data: TablesInsert<'issues'>
): Promise<Result> {
  try {
    if (!data.id)
      return {
        data: null,
        error: 'Cannot update this issue as no ID has been provided',
      };
    const supabase = await createServiceClient();
    const { data: issueUpdateData, error } = await supabase
      .from('issues')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    if (error || !issueUpdateData) {
      return {
        data: null,
        error: `Failed to update issue with id ${data.id}. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }

    revalidatePath('/');

    return {
      data: issueUpdateData,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      error: 'SERVER ERROR: An unexpected server error occurred. (updateIssue)',
    };
  }
}

export async function deleteIssue(id: number): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('issues')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      return {
        data: null,
        error: `Failed to delete issue with id ${id} or the issue does not exist. Code: ${deleteError?.code || 'UNKNOWN'}`,
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
      error: 'SERVER ERROR: An unexpected server error occurred. (deleteIssue)',
    };
  }
}
