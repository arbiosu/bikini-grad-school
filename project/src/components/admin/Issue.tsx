'use client';

import handleIssueDelete from '@/actions/handleIssueDelete';
import { type Tables } from '@/lib/supabase/database';
import LinkButton from './LinkButton';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IssueAdminCard({
  id,
  title,
  is_published,
  publication_date,
  created_at,
}: Tables<'issues'>) {
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
        onClick={() => handleIssueDelete(id)}
        className='mt-4 rounded-md bg-rose-600 p-2'
      >
        Delete Issue
      </Button>
    </div>
  );
}
