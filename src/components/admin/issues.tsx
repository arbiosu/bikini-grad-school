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
import { deleteIssue } from '@/lib/supabase/model/issues';

export default function IssueCard({ issue }: { issue: Tables<'issues'> }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);

  const handleDelete = async () => {
    // todo
    const { data, error } = await deleteIssue(issue.id);
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
        <CardTitle className='text-center text-2xl'>{issue.title}</CardTitle>
        <div className='mx-auto'>
          <Image src='/bgs-logo.png' alt='alt' width={64} height={64} />
        </div>
      </CardHeader>
      <CardContent>
        <p className='font-bold'>
          • status: {issue.published ? 'PUBLISHED' : 'DRAFT'}
        </p>
        <p>• issue number: {issue.issue_number}</p>
        <p>• publication date: {issue.publication_date}</p>
        <p>• ID: {issue.id}</p>
        <p>• created at: {issue.created_at}</p>
      </CardContent>
      <Button asChild className='mx-auto w-1/2 bg-violet-800 text-white'>
        <Link href={`/admin/content/issues/edit/${issue.id}`}>Edit Issue</Link>
      </Button>
      <Button
        onClick={() => setShowDeleteConfirm(true)}
        className='mx-auto w-1/2 bg-rose-400'
      >
        Delete Issue
      </Button>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the issue: {issue.title}. This will
              delete ALL CONTENT associated with this issue. This action cannot
              be undone.
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
