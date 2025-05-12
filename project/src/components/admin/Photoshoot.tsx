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
import { deletePhotoshoot } from '@/lib/supabase/model/photoshoots';

export function PhotoshootAdminCard({
  id,
  title,
  description,
  created_at,
}: Tables<'photoshoots'>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleDelete = async () => {
    await deletePhotoshoot(id);
    setShowDeleteConfirm(false);
  };
  return (
    <div className='mx-auto rounded-md border border-black p-10 text-center'>
      <p className='text-xl'>Title: {title}</p>
      <p className='text-xl'>Description: {description}</p>
      <p className='text-xl'>
        Created on: {new Date(created_at).toLocaleDateString()}
      </p>
      <LinkButton
        href={`/admin/photoshoots/edit/${id}`}
        label='Edit Photoshoot'
        Icon={Pencil}
      />
      <Button
        onClick={() => setShowDeleteConfirm(true)}
        className='mt-4 rounded-md bg-rose-600 p-2'
      >
        Delete Photoshoot
      </Button>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the photoshoot: {title}. This action
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

export default function PhotoshootsAdminGrid({
  photoshoots,
}: {
  photoshoots: Tables<'photoshoots'>[];
}) {
  return (
    <Grid
      items={photoshoots}
      renderItem={(photoshoot) => <PhotoshootAdminCard {...photoshoot} />}
    />
  );
}
