'use server';

import { revalidatePath } from 'next/cache';
import { createIssue } from '@/lib/supabase/model';
import { type TablesInsert } from '@/lib/supabase/database';

export default async function handleIssueCreate(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const title = formData.get('title')?.toString() ?? 'UNTITLED ISSUE';
    const description = formData.get('description')?.toString() ?? '';
    const isPublished = formData.get('is_published') === 'true';
    const file = formData.get('file') as File;

    if (!file || !(file instanceof File)) {
      return { success: false, error: 'Invalid file upload' };
    }
    const issueData: TablesInsert<'issues'> = {
      title,
      description,
      is_published: isPublished,
    };

    const { error } = await createIssue(issueData, file);

    if (error) {
      console.log(error);
      return { success: false, error: 'Failed to create issue' };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('Issue creation error:', err);
    return { success: false, error: 'Unexpected server error' };
  }
}
