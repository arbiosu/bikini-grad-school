'use server';

import type {
  PhotoshootContributor,
  PhotoshootContributorResult,
  PhotoshootContributorsNamesResult,
} from './types';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '../service';

export async function getPhotoshootContributors(
  pId: string
): Promise<PhotoshootContributorsNamesResult> {
  try {
    const supabase = await createClient();
    const selectQuery = `role:creative_roles!photoshoot_contributors_role_id_fkey(name), contributor:contributors!photoshoot_contributors_contributor_id_fkey(name)`;
    const { data: pcData, error } = await supabase
      .from('photoshoot_contributors')
      .select(selectQuery)
      .eq('photoshoot_id', pId);
    if (error) {
      console.error(
        `Supabase error retrieving photoshoot_contributors for photoshoot ${pId}: ${error.message}`,
        error
      );
      return { data: null, error: `Could not get contributors!` };
    }
    if (!pcData) {
      return { data: null, error: null };
    }
    return { data: pcData, error: null };
  } catch (err) {
    let errorMessage =
      'An unexpected error occurred while fetching photoshoot contributors.';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    console.error(
      `Unexpected error in getPhotoshootContributors for photoshoot ${pId}: ${errorMessage}`,
      err
    );
    return { data: null, error: errorMessage };
  }
}

export async function assignPhotoshootContributor(
  pc: PhotoshootContributor
): Promise<PhotoshootContributorResult> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('photoshoot_contributors')
      .insert(pc)
      .select()
      .single();
    if (error) {
      console.error(
        'Supabase insert error in assignPhotoshootContributor: ',
        error
      );
      return {
        data: null,
        error: `Failed to create photoshoot contributor. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    console.log('Photoshoot Contributor succesfully added!');
    return {
      data: data,
      error: null,
    };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: 'Unknown Error (aPC)',
    };
  }
}
