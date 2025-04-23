// CRUD for issues table
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { uploadImage } from '@/lib/supabase/model/storage';
import {
  IssueInsert,
  IssueResult,
  QueryIssuesOptions,
  QueryIssuesResult,
} from '@/lib/supabase/model/types';
import { MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from './constants';

export async function queryIssues(
  options: QueryIssuesOptions = { sort: { order: 'desc' } }
): Promise<QueryIssuesResult> {
  try {
    const supabase = await createClient();
    // Have to use "as '*'" here as Supabase expects a string literal
    // https://github.com/supabase/supabase-js/issues/551#issuecomment-1246189359
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
      query = query.eq('is_published', options.filter.published);
    }

    const sortColumn = options.sort?.column ?? 'created_at';
    const sortOrder = options.sort?.order ?? 'desc';

    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error('Supabase query error in queryIssues: ', error);
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
  } catch (err) {
    console.error('Unexpected error in queryIssues: ', err);
    return {
      data: null,
      error: '[queryIssues] An unexpected error occurred',
      count: null,
    };
  }
}

export async function createIssue(
  issueData: IssueInsert,
  file: File
): Promise<IssueResult> {
  let uploadedImagePath: string | null = null;
  try {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        data: null,
        error: `Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(', ')}`,
      };
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return {
        data: null,
        error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`,
      };
    }

    uploadedImagePath = await uploadImage(file, '/content');
    if (!uploadedImagePath) {
      return { data: null, error: 'Image upload failed' };
    }
    const finalIssueData: IssueInsert = {
      ...issueData,
      ...{ cover_image_path: uploadedImagePath },
    };

    const supabase = await createServiceClient();
    const { data: insertedData, error: insertError } = await supabase
      .from('issues')
      .insert(finalIssueData)
      .select()
      .single();
    if (insertError || !insertedData) {
      console.error('Supabase insert error in createIssue: ', insertError);
      if (uploadedImagePath) {
        console.warn(
          `Database insert failed. Attempting to delete orphaned image ${uploadedImagePath}`
        );
        try {
          console.log('TODO: implement delete image');
        } catch (cleanupError) {
          console.warn(
            `Failed to delete orphaned image ${uploadedImagePath} with error: `,
            cleanupError
          );
        }
      }
      return {
        data: null,
        error: `Failed to create issue. Code: ${insertError?.code || 'UNKNOWN'}`,
      };
    }
    // -- Success --
    console.log(
      `Issue created successfull with ID: ${insertedData.id}. Revalidating paths...`
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
    console.error('Unexpected error in createIssue:', err);
    return {
      data: null,
      error: 'SERVER_ERROR: An unexpected server error occurred.',
    };
  }
}

export async function editIssue(issueData: IssueInsert): Promise<IssueResult> {
  try {
    const supabase = await createServiceClient();
    const { data: insertedData, error: insertError } = await supabase
      .from('issues')
      .update({ ...issueData })
      .eq('id', issueData.id!)
      .select()
      .single();
    if (insertError || !insertedData) {
      console.error(`Failed to edit issue with id ${issueData.id}`);
      return {
        data: null,
        error: `Failed to create issue. Code: ${insertError?.code || 'UNKNOWN'}`,
      };
    }
    // -- Success --
    console.log(
      `Issue with id ${insertedData.id} updated successfully. Revalidating paths...`
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
    console.error('Unexpected error in editIssue:', err);
    return {
      data: null,
      error: 'SERVER_ERROR: An unexpected server error occurred.',
    };
  }
}

export async function deleteIssue(id: number): Promise<IssueResult> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('issues')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      console.error(`Failed to delete issue with id ${id}`);
      return {
        data: null,
        error: `Failed to delete issue. Code: ${deleteError?.code || 'UNKNOWN'}`,
      };
    }
    // -- Success --
    console.log(
      `Issue with id ${deletedData.id} has been successfully deleted. Revalidating paths...`
    );
    revalidatePath('/');
    revalidatePath('/past-issues');
    revalidatePath('/admin');
    revalidatePath('/admin/issues');
    return {
      data: deletedData,
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error in deleteIssue:', err);
    return {
      data: null,
      error: 'SERVER_ERROR: An unexpected server error occurred.',
    };
  }
}
