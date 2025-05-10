'use client';

import { useState } from 'react';
import { type Tables } from '@/lib/supabase/database';
import LinkButton from './LinkButton';
import { Pencil } from 'lucide-react';
import { Button } from '../ui/button';
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

export function ContributorAdminCard({
  id,
  name,
  bio,
  type,
  created_at,
}: Tables<'contributors'>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleDelete = async () => {
    //await deleteContributor(id);
    setShowDeleteConfirm(false);
  };
  return (
    <div className='mx-auto rounded-md border border-black p-10 text-center'>
      <p className='text-xl'>Name: {name}</p>
      <p className='text-xl'>Bio: {bio}</p>
      <p className='text-xl'>Type: {type}</p>

      <p className='text-xl'>
        Created on: {new Date(created_at).toLocaleDateString()}
      </p>
      <LinkButton
        href={`/admin/contributors/edit/${id}`}
        label='Edit Contributor'
        Icon={Pencil}
      />
      <Button
        onClick={() => setShowDeleteConfirm(true)}
        className='mt-4 rounded-md bg-rose-600 p-2'
      >
        Delete Contributor
      </Button>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the contributor: {name}. This action
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

export default function ContributorAdminGrid({
  contributors,
}: {
  contributors: Tables<'contributors'>[];
}) {
  return (
    <Grid
      items={contributors}
      renderItem={(contributor) => <ContributorAdminCard {...contributor} />}
    />
  );
}
