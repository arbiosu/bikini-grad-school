'use client';

import handleArticleDelete from '@/actions/handleArticleDelete';
import { type Tables } from '@/lib/supabase/database';
import LinkButton from './LinkButton';
import { Pencil } from 'lucide-react';
import { Button } from '../ui/button';

export function ArticleAdminCard({
  id,
  title,
  author,
  created_at,
  is_published,
}: Tables<'articles'>) {
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
        onClick={() => handleArticleDelete(id)}
        className='mt-4 rounded-md bg-rose-600 p-2'
      >
        Delete Article
      </Button>
    </div>
  );
}
