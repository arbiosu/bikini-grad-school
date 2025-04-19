'use server';

import { deleteArticle } from '@/lib/supabase/model';
import { revalidatePath } from 'next/cache';

export default async function handleArticleDelete(id: string) {
  const deleted = await deleteArticle(id);
  if (!deleted) {
    console.log('Could not delete article');
  }
  console.log(`Deleted article with id ${id}`);
  revalidatePath('/');
}
