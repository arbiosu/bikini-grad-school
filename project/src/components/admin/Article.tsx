'use client';

import { useState } from 'react';
import handleArticleDelete from '@/actions/handleArticleDelete';
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

export function ArticleAdminCard({
  id,
  title,
  author,
  created_at,
  is_published,
}: Tables<'articles'>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleDelete = async () => {
    await handleArticleDelete(id);
    setShowDeleteConfirm(false);
  };
  return (
    <div className='mx-auto rounded-md border border-black p-10 text-center'>
      <p className='text-xl'>Title: {title}</p>
      <p className='text-xl'>Author: {author}</p>
      <p className='text-xl'>
        Created on: {new Date(created_at).toLocaleDateString()}
      </p>
      <p className='text-xl'>Published: {is_published ? 'true' : 'false'}</p>
      <LinkButton
        href={`/admin/articles/edit/${id}`}
        label='Edit Article'
        Icon={Pencil}
      />
      <Button
        onClick={() => setShowDeleteConfirm(true)}
        className='mt-4 rounded-md bg-rose-600 p-2'
      >
        Delete Article
      </Button>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the article: {title}. This action
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

export default function ArticleAdminGrid({
  articles,
}: {
  articles: Tables<'articles'>[];
}) {
  return (
    <Grid
      items={articles}
      renderItem={(article) => <ArticleAdminCard {...article} />}
    />
  );
}
