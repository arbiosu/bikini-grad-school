'use server';

import { deleteIssue } from '@/lib/supabase/model';
import { revalidatePath } from 'next/cache';

export default async function handleIssueDelete(id: number) {
  const deleted = await deleteIssue(id);
  if (!deleted) {
    console.log('Could not delete issue');
  }
  console.log(`Deleted issue with id ${id}`);
  revalidatePath('/');
}
