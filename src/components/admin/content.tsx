'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
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
} from '@/components/ui/alert-dialog';

import { Tables } from '@/lib/supabase/database/types';
import { deleteContent } from '@/lib/supabase/model/contents';

export default function ContentCard({
  content,
}: {
  content: Tables<'contents'>;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);

  const handleDelete = async () => {
    const { data, error } = await deleteContent(content.id);
    if (error) {
      setDeleteSuccess(false);
    } else {
      setDeleteSuccess(true);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <Card className='mx-auto w-full max-w-sm border-2'>
      <CardHeader>
        <CardTitle className='text-center text-2xl'>{content.title}</CardTitle>
        <div className='mx-auto'>
          <Image src='/bgs-logo.png' alt='alt' width={64} height={64} />
        </div>
      </CardHeader>
      <CardContent>
        <p className='font-bold'>
          • status: {content.published ? 'PUBLISHED' : 'DRAFT'}
        </p>
        <p>• ID: {content.id}</p>
        <p>• type: {content.type}</p>
        <p>• Issue ID: {content.issue_id}</p>
        <p>• Created At: {content.created_at}</p>
        <p>• Publication Date: {content.published_at}</p>
      </CardContent>
      <Button asChild className='mx-auto w-1/2 bg-violet-800 text-white'>
        <Link href={`/admin/content/${content.id}/edit`}>Edit Content</Link>
      </Button>
      <Button
        onClick={() => setShowDeleteConfirm(true)}
        className='mx-auto w-1/2 bg-rose-400'
      >
        Delete Content
      </Button>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the content: {content.title}. This
              action cannot be undone.
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
    </Card>
  );
}
