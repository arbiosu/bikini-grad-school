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
  data: Tables<'content_metrics'> | null;
  error: string | null;
};

interface QueryContentMetricsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Tables<'content_metrics'>)[];
  sort?: {
    column?: keyof Tables<'content_metrics'>;
    order: SortOrder;
  };
  limit?: number;
}

interface QueryContentMetricsResult {
  data: Tables<'content_metrics'>[] | null;
  error: string | null;
  count: number | null;
}

export async function createContentMetrics(
  data: TablesInsert<'content_metrics'>
): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: insertData, error } = await supabase
      .from('content_metrics')
      .insert(data)
      .select()
      .single();
    if (error || !insertData) {
      return {
        data: null,
        error: `Failed to create content metrics. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    revalidatePath('/');
    return { data: insertData, error: null };
  } catch (e) {
    return {
      data: null,
      error:
        'SERVER ERROR: An unexpected server error occurred. (createContentMetrics)',
    };
  }
}

export async function queryContentMetrics(
  options: QueryContentMetricsOptions = { sort: { order: 'desc' } }
): Promise<QueryContentMetricsResult> {
  try {
    const supabase = await createClient();

    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = supabase.from('content_metrics').select(selectColumns as '*', {
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
      console.error('Supabase error in queryContentMetrics: ', error);
      return {
        data: null,
        error: `Failed to query content metrics. Code: ${error.code || 'UNKNOWN'}`,
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
      error: '[queryRoles] An unexpected error occurred',
      count: null,
    };
  }
}

export async function updateContentMetric(
  data: TablesInsert<'creative_roles'>
): Promise<Result> {
  try {
    if (!data.id)
      return {
        data: null,
        error: 'Cannot update this CM as no ID has been provided',
      };
    const supabase = await createServiceClient();
    const { data: updateData, error } = await supabase
      .from('content_metrics')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    if (error || !updateData) {
      return {
        data: null,
        error: `Failed to update CM with id ${data.id}. Code: ${error?.code || 'UNKNOWN'}`,
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

export async function deleteConentMetric(id: number): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('content_metrics')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      return {
        data: null,
        error: `Failed to delete CM with id ${id} or the contributor does not exist. Code: ${deleteError?.code || 'UNKNOWN'}`,
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
      error: 'SERVER ERROR: An unexpected server error occurred. (deleteCM)',
    };
  }
}
