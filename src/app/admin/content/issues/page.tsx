import { queryIssues } from '@/lib/supabase/model/issues';
import IssueCard from '@/components/admin/issues';

import BackButton from '@/components/admin/back-button';

export default async function Page() {
  const { data, error } = await queryIssues({});

  if (!data || error) return; //todo

  return (
    <section className='mx-auto max-w-7xl px-2'>
      <div className='flex gap-8'>
        <BackButton href='/admin/content' label='Back' />
        <h1 className='text-center text-lg font-bold underline sm:text-2xl'>
          Admin Portal - Content - Manage Issues
        </h1>
      </div>
      <div className='grid gap-4 p-10 lg:grid-cols-3'>
        {data.map((issue, i) => (
          <div key={`${i}-${new Date()}`}>
            <IssueCard issue={issue} />
          </div>
        ))}
      </div>
    </section>
  );
}
