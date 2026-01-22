import { redirect } from 'next/navigation';
import { queryIssues } from '@/lib/supabase/model/issues';

import BackButton from '@/components/admin/back-button';
import { IssueForm } from '@/components/admin/forms/issues';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;
  const { data, error } = await queryIssues({
    filter: {
      id: id,
    },
  });
  if (error || !data) {
    redirect('/admin/error');
  }
  const issue = data[0];
  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/content/issues/manage' label='Back' />
      </div>
      <IssueForm mode={'edit'} issue={issue} />
    </section>
  );
}
