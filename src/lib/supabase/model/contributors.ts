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
  data: Tables<'contributors'> | null;
  error: string | null;
};

interface QueryContributorsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Tables<'contributors'>)[];
  sort?: {
    column?: keyof Tables<'contributors'>;
    order: SortOrder;
  };
  limit?: number;
}

interface QueryContributorsResult {
  data: Tables<'contributors'>[] | null;
  error: string | null;
  count: number | null;
}

export async function createContributor(
  data: TablesInsert<'contributors'>
): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: contributorInsertData, error } = await supabase
      .from('contributors')
      .insert(data)
      .select()
      .single();
    if (error || !contributorInsertData) {
      return {
        data: null,
        error: `Failed to create contributor. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    revalidatePath('/');
    return { data: contributorInsertData, error: null };
  } catch (e) {
    return {
      data: null,
      error:
        'SERVER ERROR: An unexpected server error occurred. (createContributor)',
    };
  }
}

export async function queryContributor(
  options: QueryContributorsOptions = { sort: { order: 'desc' } }
): Promise<QueryContributorsResult> {
  try {
    const supabase = await createClient();

    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = supabase.from('contributors').select(selectColumns as '*', {
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
      console.error('Supabase error in queryContributors: ', error);
      return {
        data: null,
        error: `Failed to query contributors. Code: ${error.code || 'UNKNOWN'}`,
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
      error: '[queryContributors] An unexpected error occurred',
      count: null,
    };
  }
}

export async function updateContributor(
  data: TablesInsert<'contributors'>
): Promise<Result> {
  try {
    if (!data.id)
      return {
        data: null,
        error: 'Cannot update this contributor as no ID has been provided',
      };
    const supabase = await createServiceClient();
    const { data: contributorsUpdateData, error } = await supabase
      .from('contributors')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    if (error || !contributorsUpdateData) {
      return {
        data: null,
        error: `Failed to update contributor with id ${data.id}. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }

    revalidatePath('/');

    return {
      data: contributorsUpdateData,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      error:
        'SERVER ERROR: An unexpected server error occurred. (updateContributor)',
    };
  }
}

export async function deleteContributor(id: number): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('contributors')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      return {
        data: null,
        error: `Failed to delete contributor with id ${id} or the contributor does not exist. Code: ${deleteError?.code || 'UNKNOWN'}`,
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
        'SERVER ERROR: An unexpected server error occurred. (deleteContributor)',
    };
  }
}
