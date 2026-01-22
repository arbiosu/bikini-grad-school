import { redirect } from 'next/navigation';
import { queryContents } from '@/lib/supabase/model/contents';

import { ArticleForm } from '@/components/admin/forms/article';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;
  const { data, error } = await queryContents({
    filter: {
      id: id,
    },
  });
  if (error || !data) {
    redirect('/admin/error');
  }
  // todo: fix this to query single
  const content = data[0];

  return (
    <section className='container mx-auto'>
      <div className='grid justify-center'>
        <div className='grid'>
          <p className='font-bold'>Title: {content.title}</p>
        </div>
        <div className='grid'>
          <p>Type: {content.type}</p>
        </div>
        <div className='grid'>
          <p>Summary: {content.summary}</p>
        </div>
        <div className='grid'>
          <p>Status: {content.published ? 'Published' : 'Draft'}</p>
        </div>
        <div className='grid'>
          <p>URL Slug: {content.slug}</p>
        </div>
        <div className='grid'>
          <p>Created At: {content.created_at}</p>
        </div>
        <div className='grid'>
          <p>Publication Date: {content.published_at}</p>
        </div>
      </div>
    </section>
  );
}
