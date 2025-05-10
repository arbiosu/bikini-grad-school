'use server';

import type {
  PhotoshootContributor,
  PhotoshootContributorResult,
} from './types';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '../service';

export async function getPhotoshootContributors(pId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('photoshoot_contributors')
      .select(
        `
        role:roles(name)
        id:contributors(id)
        name:contributors(name)
        `
      )
      .eq('photoshoot_id', pId);
    if (error) {
      console.error(
        `Supabase error retrieving photoshoot_contributors for photoshoot ${pId}`
      );
    }
    return data;
  } catch (err) {
    console.error(err);
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
