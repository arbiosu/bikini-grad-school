import { queryContents } from '@/lib/supabase/model/contents';

import ContentCard from '@/components/admin/content';
import BackButton from '@/components/admin/back-button';

export default async function Page() {
  const { data, error } = await queryContents({});

  if (!data || error) return; //todo

  return (
    <section className='mx-auto max-w-7xl px-2'>
      <div className='flex gap-8'>
        <BackButton href='/admin/content' label='Back' />
        <h1 className='text-center text-lg font-bold underline sm:text-2xl'>
          Admin Portal - Content - Manage Content
        </h1>
      </div>
      <div className='grid gap-4 p-10 lg:grid-cols-3'>
        {data.map((content, i) => (
          <div key={`${i}-${new Date()}`}>
            <ContentCard content={content} />
          </div>
        ))}
      </div>
    </section>
  );
}
