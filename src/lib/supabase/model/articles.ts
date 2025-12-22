'use server';

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
  data: Tables<'articles'> | null;
  error: string | null;
};

interface QueryArticlesOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Tables<'articles'>)[];
  sort?: {
    column?: keyof Tables<'articles'>;
    order: SortOrder;
  };
  limit?: number;
}

interface QueryArticlesResult {
  data: Tables<'contents'>[] | null;
  error: string | null;
  count: number | null;
}

export async function createArticle(
  data: TablesInsert<'articles'>
): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: articlesInsertData, error } = await supabase
      .from('articles')
      .insert(data)
      .select()
      .single();
    if (error || !articlesInsertData) {
      return {
        data: null,
        error: `Failed to create article. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    revalidatePath('/');
    return { data: articlesInsertData, error: null };
  } catch (e) {
    return {
      data: null,
      error:
        'SERVER ERROR: An unexpected server error occurred. (createContent)',
    };
  }
}

export async function updateArticle(
  data: TablesInsert<'articles'>
): Promise<Result> {
  try {
    if (!data.id)
      return {
        data: null,
        error: 'Cannot update this article as no ID has been provided',
      };
    const supabase = await createServiceClient();
    const { data: articleUpdateData, error } = await supabase
      .from('articles')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    if (error || !articleUpdateData) {
      return {
        data: null,
        error: `Failed to update article with id ${data.id}. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }

    revalidatePath('/');

    return {
      data: articleUpdateData,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      error:
        'SERVER ERROR: An unexpected server error occurred. (updateArticle)',
    };
  }
}

export async function deleteArticle(id: number): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      return {
        data: null,
        error: `Failed to delete article with id ${id} or the content does not exist. Code: ${deleteError?.code || 'UNKNOWN'}`,
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
        'SERVER ERROR: An unexpected server error occurred. (deleteArticle)',
    };
  }
}
