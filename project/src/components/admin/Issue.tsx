'use client';

import { useState } from 'react';
import handleIssueDelete from '@/actions/handleIssueDelete';
import { type Tables } from '@/lib/supabase/database';
import LinkButton from './LinkButton';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import Grid from '@/components/Grid';

export function IssueAdminCard({
  id,
  title,
  is_published,
  publication_date,
  created_at,
}: Tables<'issues'>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const handleDelete = async () => {
    await handleIssueDelete(id);
    setShowDeleteConfirm(false);
  };
  return (
    <div className='mx-auto rounded-md border border-black p-10 text-center'>
      <p className='text-xl'>
        <span className='font-bold'>Issue: </span>
        {title}
      </p>
      <p className='text-xl'>Published: {is_published ? 'true' : 'false'}</p>
      <p className='text-xl'>
        {publication_date
          ? `Publication Date: ${new Date(publication_date).toLocaleDateString()}`
          : 'No publication date'}
      </p>
      <p className='text-xl'>
        Created on: {new Date(created_at).toLocaleDateString()}
      </p>
      <LinkButton
        href={`/admin/issues/edit/${id}`}
        label='Edit Issue'
        Icon={Pencil}
      />
      <Button
        onClick={() => setShowDeleteConfirm(true)}
        className='mt-4 rounded-md bg-rose-600 p-2'
      >
        Delete Issue
      </Button>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the issue: {title}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-rose-600 hover:bg-rose-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function IssuesAdminGrid({
  issues,
}: {
  issues: Tables<'issues'>[];
}) {
  return (
    <Grid
      items={issues}
      renderItem={(issue) => <IssueAdminCard {...issue} />}
    />
  );
}
