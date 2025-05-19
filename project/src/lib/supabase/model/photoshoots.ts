'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '../service';
import {
  QueryPhotoshootsOptions,
  QueryPhotoshootsResult,
  PhotoshootsResult,
  PhotoshootInsert,
} from './types';

export async function queryPhotoshoots(
  options: QueryPhotoshootsOptions = { sort: { order: 'desc' } }
): Promise<QueryPhotoshootsResult> {
  try {
    const supabase = await createClient();
    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';
    let query = supabase.from('photoshoots').select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }

    if (options.filter?.issueId) {
      query = query.eq('issue_id', options.filter.issueId);
    }

    const sortColumn = options.sort?.column ?? 'created_at';
    const sortOrder = options.sort?.order ?? 'desc';

    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error('Supabase query error in queryPhotoshoots: ', error);
      return {
        data: null,
        error: `Failed to query photoshoots. Code: ${error.code || 'UNKNOWN'}`,
        count: null,
      };
    }
    return {
      data: data,
      error: null,
      count: count,
    };
  } catch (err) {
    console.error('Unexpected error in queryPhotoshoots:', err);
    return {
      data: null,
      error: '[queryPhotoshoots] An unexpected error occurred',
      count: null,
    };
  }
}

export async function createPhotoshoot(
  photoshootData: PhotoshootInsert
): Promise<PhotoshootsResult> {
  try {
    const finalPhotoshootData: PhotoshootInsert = {
      ...photoshootData,
    };

    const supabase = await createServiceClient();
    const { data: insertedData, error: insertError } = await supabase
      .from('photoshoots')
      .insert(finalPhotoshootData)
      .select()
      .single();

    if (insertError || !insertedData) {
      console.error('Supabase insert error in createPhotoshoot: ', insertError);
      return {
        data: null,
        error: `Failed to create photoshoot. Code: ${insertError?.code || 'UNKNOWN'}`,
      };
    }
    console.log(
      `Photoshoot created successfully with ID: ${insertedData.id}. Revalidating paths...`
    );
    revalidatePath('/');
    revalidatePath('/issues');
    revalidatePath('/admin');
    revalidatePath('/admin/issues');
    return {
      data: insertedData,
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error in createPhotoshoot:', err);
    return {
      data: null,
      error: 'SERVER_ERROR: An unexpected server error occurred.',
    };
  }
}

export async function editPhotoshoot(
  photoshootData: PhotoshootInsert
): Promise<PhotoshootsResult> {
  try {
    const supabase = await createServiceClient();
    const { data: insertedData, error: insertError } = await supabase
      .from('photoshoots')
      .update({ ...photoshootData })
      .eq('id', photoshootData.id!)
      .select()
      .single();
    if (insertError || !insertedData) {
      console.error(`Failed to edit photoshoot with id ${photoshootData.id}`);
      return {
        data: null,
        error: `Failed to create photoshoot. Code: ${insertError?.code || 'UNKNOWN'}`,
      };
    }
    // -- Success --
    console.log(
      `Photoshoot with id ${insertedData.id} updated successfully. Revalidating paths...`
    );
    revalidatePath('/');
    revalidatePath('/issues');
    revalidatePath('/admin');
    revalidatePath('/admin/issues');
    return {
      data: insertedData,
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error in editPhotoshoot:', err);
    return {
      data: null,
      error: 'SERVER_ERROR: An unexpected server error occurred.',
    };
  }
}

export async function deletePhotoshoot(id: string): Promise<PhotoshootsResult> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('photoshoots')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      console.error(`Failed to delete photoshoot with id ${id}`);
      return {
        data: null,
        error: `Failed to delete photoshoot. Code: ${deleteError?.code || 'UNKNOWN'}`,
      };
    }
    // -- Success --
    console.log(`Photoshoot with id ${deletedData.id} has been deleted`);
    revalidatePath('/');
    revalidatePath('/issues');
    revalidatePath('/admin');
    revalidatePath('/admin/photoshoots');
    return {
      data: deletedData,
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error in deletePhotoshoot', err);
    return {
      data: null,
      error: 'SERVER_ERROR: An unexpected server error occurred',
    };
  }
}
