'use server';

import type { FetchRolesResult } from './types';
import { createClient } from '../server';

export async function fetchRoles(): Promise<FetchRolesResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('creative_roles').select();
    if (error) {
      console.error(error);
      return {
        data: null,
        error: `Could not fetch roles: ${error.code}`,
      };
    }
    return {
      data: data,
      error: null,
    };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: 'Unknown Error',
    };
  }
}
