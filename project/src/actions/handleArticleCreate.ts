'use server';

import { revalidatePath } from 'next/cache';
import { createArticle } from '@/lib/supabase/model';
import { type TablesInsert } from '@/lib/supabase/database';

export default async function handleIssueCreate(
  article: TablesInsert<'articles'>,
  file: File
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await createArticle(article, file);

    if (error) {
      return { success: false, error: 'Failed to create article' };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('Issue creation error:', err);
    return { success: false, error: 'Unexpected server error' };
  }
}
