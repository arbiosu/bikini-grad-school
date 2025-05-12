'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '../service';
import {
  QueryContributorsOptions,
  QueryContributorsResult,
  ContributorResult,
  ContributorInsert,
} from './types';

export async function queryContributors(
  options: QueryContributorsOptions = { sort: { order: 'desc' } }
): Promise<QueryContributorsResult> {
  try {
    const supabase = await createClient();
    // Have to use "as '*'" here as Supabase expects a string literal
    // https://github.com/supabase/supabase-js/issues/551#issuecomment-1246189359
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
      console.error('Supabase query error in queryContributors: ', error);
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
  } catch (err) {
    console.error('Unexpected error in queryContributors:', err);
    return {
      data: null,
      error: '[queryContributors] An unexpected error occurred',
      count: null,
    };
  }
}

export async function createContributor(
  contributorData: ContributorInsert
): Promise<ContributorResult> {
  try {
    const supabase = await createServiceClient();
    const { data: insertedData, error: insertError } = await supabase
      .from('contributors')
      .insert(contributorData)
      .select()
      .single();

    if (insertError || !insertedData) {
      console.error(
        'Supabase insert error in createContributor: ',
        insertError
      );
      return {
        data: null,
        error: `Failed to create contributor. Code: ${insertError?.code} || 'UNKNOWN`,
      };
    }
    console.log(
      `Contributor created successfully with ID: ${insertedData.id}. Revalidating paths...`
    );
    revalidatePath('/');
    revalidatePath('/past-issues');
    revalidatePath('/admin');
    revalidatePath('/admin/issues');
    return {
      data: insertedData,
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error in createContributor: ', err);
    return {
      data: null,
      error: 'SERVER ERROR: An unexpected server error occurred',
    };
  }
}

export async function editContributor(
  contributorData: ContributorInsert
): Promise<ContributorResult> {
  try {
    const supabase = await createServiceClient();
    const { data: insertedData, error: insertError } = await supabase
      .from('contributors')
      .update({ ...contributorData })
      .eq('id', contributorData.id!)
      .select()
      .single();

    if (insertError || !insertedData) {
      console.error('Supabase update error in editContributor: ', insertError);
      return {
        data: null,
        error: `Failed to edit contributor. Code: ${insertError?.code} || 'UNKNOWN`,
      };
    }
    console.log(
      `Contributor edited successfully with ID: ${insertedData.id}. Revalidating paths...`
    );
    revalidatePath('/');
    revalidatePath('/past-issues');
    revalidatePath('/admin');
    revalidatePath('/admin/issues');
    return {
      data: insertedData,
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error in editContributor: ', err);
    return {
      data: null,
      error: 'SERVER ERROR: An unexpected server error occurred',
    };
  }
}
