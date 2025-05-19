// CRUD for articles table
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../server';
import { createServiceClient } from '../service';
import {
  QueryArticlesOptions,
  QueryArticlesResult,
  ArticleInsert,
  ArticleResult,
} from '@/lib/supabase/model/types';

export async function queryArticles(
  options: QueryArticlesOptions = { sort: { order: 'desc' } }
): Promise<QueryArticlesResult> {
  try {
    const supabase = await createClient();
    // Have to use "as '*'" here as Supabase expects a string literal
    // https://github.com/supabase/supabase-js/issues/551#issuecomment-1246189359
    const selectColumns = options.select?.length
      ? options.select.join(', ')
      : '*';
    let query = supabase.from('articles').select(selectColumns as '*', {
      count: options.count,
      head: options.onlyCount ?? false,
    });

    if (options.filter?.id) {
      query = query.eq('id', options.filter.id);
    }

    if (options.filter?.issueId) {
      query = query.eq('issue_id', options.filter.issueId);
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
      console.error('Supabase query error in queryArticles: ', error);
      return {
        data: null,
        error: `Failed to query articles. Code: ${error.code || 'UNKNOWN'}`,
        count: null,
      };
    }
    return {
      data: data,
      error: null,
      count: count,
    };
  } catch (err) {
    console.error('Unexpected error in queryArticles:', err);
    return {
      data: null,
      error: '[queryArticles] An unexpected error occurred',
      count: null,
    };
  }
}

export async function createArticle(
  articleData: ArticleInsert
): Promise<ArticleResult> {
  try {
    const finalArticleData: ArticleInsert = {
      ...articleData,
    };

    const supabase = await createServiceClient();
    const { data: insertedData, error: insertError } = await supabase
      .from('articles')
      .insert(finalArticleData)
      .select()
      .single();
    if (insertError || !insertedData) {
      console.error('Supabase insert error in createArticle: ', insertError);
      return {
        data: null,
        error: `Failed to create article. Code: ${insertError?.code || 'UNKNOWN'}`,
      };
    }
    // -- Success --
    console.log(
      `Article created successfully with ID: ${insertedData.id}. Revalidating paths...`
    );
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');
    revalidatePath('/admin/articles');
    return {
      data: insertedData,
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error in createArticle:', err);
    return {
      data: null,
      error: 'SERVER_ERROR: An unexpected server error occurred.',
    };
  }
}

export async function editArticle(
  articleData: ArticleInsert
): Promise<ArticleResult> {
  try {
    const supabase = await createServiceClient();
    const { data: insertedData, error: insertError } = await supabase
      .from('articles')
      .update({ ...articleData })
      .eq('id', articleData.id!)
      .select()
      .single();
    if (insertError || !insertedData) {
      console.error(`Failed to edit article with id ${articleData.id}`);
      return {
        data: null,
        error: `Failed to create article. Code: ${insertError?.code || 'UNKNOWN'}`,
      };
    }
    // -- Success --
    console.log(
      `Article with id ${insertedData.id} updated successfully. Revalidating paths...`
    );
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');
    revalidatePath('/admin/articles');
    return {
      data: insertedData,
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error in editrticle:', err);
    return {
      data: null,
      error: 'SERVER_ERROR: An unexpected server error occurred.',
    };
  }
}

export async function deleteArticle(id: string): Promise<ArticleResult> {
  try {
    const supabase = await createServiceClient();
    const { data: deletedData, error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (deleteError || !deletedData) {
      console.error(`Failed to delete article with id ${id}`);
      return {
        data: null,
        error: `Failed to delete article. Code: ${deleteError?.code || 'UNKNOWN'}`,
      };
    }
    // -- Success --
    console.log(
      `Article with id ${deletedData.id} has been successfully deleted. Revalidating paths...`
    );
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');
    revalidatePath('/admin/articles');
    return {
      data: deletedData,
      error: null,
    };
  } catch (err) {
    console.error('Unexpected error in deleterticle:', err);
    return {
      data: null,
      error: 'SERVER_ERROR: An unexpected server error occurred.',
    };
  }
}
