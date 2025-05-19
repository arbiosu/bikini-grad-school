'use server';

import { createServiceClient } from '@/lib/supabase/service';


interface GenerateSignedUrlResponse {
  data: {
    signedUrl: string;
    token: string;
    path: string;
  } | null;
  error: string | null;
}

export async function getAllImagesInFolder(folder: string) {
  try {
    const supabase = await createServiceClient();
    const { data, error: imgError } = await supabase.storage
      .from('images')
      .list(folder, {
        sortBy: { column: 'name', order: 'asc' },
      });
    if (imgError || !data) {
      throw new Error(`Failed to list all images in folder ${folder}`);
    }
    return {
      data: data,
      error: null,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return {
        data: null,
        error: error.message,
      };
    }
    return {
      data: null,
      error: 'Unknown Error in getAllImagesInFolder',
    };
  }
}

export async function generateSignedUploadUrl(
  path: string
): Promise<GenerateSignedUrlResponse> {
  try {
    const supabase = await createServiceClient();

    const { data, error } = await supabase.storage
      .from('images')
      .createSignedUploadUrl(path);

    if (error || !data) {
      throw new Error('Failed to generateSignedUploadUrl');
    }
    return {
      data: data,
      error: null,
    };
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return {
        data: null,
        error: err.message,
      };
    }
    return {
      data: null,
      error: 'Unknown Error in getAllImagesInFolder',
    };
  }
}
