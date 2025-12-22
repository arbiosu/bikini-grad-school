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
  data: Tables<'contents'> | null;
  error: string | null;
};

interface QueryContentsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Tables<'contents'>)[];
  sort?: {
    column?: keyof Tables<'contents'>;
    order: SortOrder;
  };
  limit?: number;
}

interface QueryContentsResult {
  data: Tables<'contents'>[] | null;
  error: string | null;
  count: number | null;
}

export async function createContent(
  data: TablesInsert<'contents'>
): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: contentsInsertData, error } = await supabase
      .from('contents')
      .insert(data)
      .select()
      .single();
    if (error || !contentsInsertData) {
      return {
        data: null,
        error: `Failed to create content. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    revalidatePath('/');
    return { data: contentsInsertData, error: null };
  } catch (e) {
    return {
      data: null,
      error:
        'SERVER ERROR: An unexpected server error occurred. (createContent)',
    };
  }
}

export async function queryContents(
  options: QueryContentsOptions = { sort: { order: 'desc' } }
): Promise<QueryContentsResult> {
  try {
    const supabase = await createClient();

    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';

    let query = supabase.from('contents').select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }

    if (options.filter?.published !== undefined) {
      query = query.eq('published', options.filter.published);
    }

    const sortColumn = options.sort?.column ?? 'created_at';
    const sortOrder = options.sort?.order ?? 'desc';

    query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error('Supabase error in queryContents: ', error);
      return {
        data: null,
        error: `Failed to query content. Code: ${error.code || 'UNKNOWN'}`,
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
      error: '[queryContents] An unexpected error occurred',
      count: null,
    };
  }
}

export async function updateContent(
  data: TablesInsert<'contents'>
): Promise<Result> {
  try {
    if (!data.id)
      return {
        data: null,
        error: 'Cannot update this content as no ID has been provided',
      };
    const supabase = await createServiceClient();
    const { data: contentsUpdateData, error } = await supabase
      .from('contents')
      .update({ ...data })
      .eq('id', data.id)
      .select()
      .single();
    if (error || !contentsUpdateData) {
      return {
        data: null,
        error: `Failed to update content with id ${data.id}. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }

    revalidatePath('/');

    return {
      data: contentsUpdateData,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      error:
        'SERVER ERROR: An unexpected server error occurred. (updateContent)',
    };
  }
}

export async function deleteIssue(id: number): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('contents')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      return {
        data: null,
        error: `Failed to delete content with id ${id} or the content does not exist. Code: ${deleteError?.code || 'UNKNOWN'}`,
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
        'SERVER ERROR: An unexpected server error occurred. (deleteContent)',
    };
  }
}

type ContentTypes = 'article' | 'feature' | 'interview' | 'digi_media';

interface ContentFormData {
  issue_id: number;
  published: boolean;
  published_at: string;
  slug: string;
  summary: string;
  title: string;
  type: ContentTypes;
}

interface ArticleFormData {
  body: string;
  featuredImage: string | null;
}

interface FeatureFormData {
  description: string;
}

interface InterviewFormData {
  intervieweeBio: string | null;
  intervieweeName: string;
  profile_image: string | null;
  transcript: string;
}

interface ContentContributor {
  contributorId: number;
  roleId: number;
}

interface DigiMediaFormData {
  mediaUrl: string;
}

type TypeSpecificData =
  | ({ type: 'article' } & ArticleFormData)
  | ({ type: 'feature' } & FeatureFormData)
  | ({ type: 'interview' } & InterviewFormData)
  | ({ type: 'digi_media' } & DigiMediaFormData);

export async function createFullContent(
  contentData: ContentFormData,
  contributorData: ContentContributor[],
  typeData: TypeSpecificData
): Promise<Result> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.rpc('create_full_content', {
      content_data: contentData,
      contributors: contributorData,
      type_data: typeData,
    });
    if (error || !data) {
      return {
        data: null,
        error: `Failed to create content. Code: ${error?.code || 'UNKNOWN'}`,
      };
    }
    revalidatePath('/', 'layout');
    return { data: data, error: null };
  } catch (err) {
    return {
      data: null,
      error: 'ERROR',
    };
  }
}
