import { queryIssues } from '@/lib/supabase/model/issues';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditIssueForm from '@/components/admin/EditIssueForm';
import LinkButton from '@/components/admin/LinkButton';
import { ArrowLeft } from 'lucide-react';

export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const issueId = (await params).id;
  const { data: issue, error } = await queryIssues({
    filter: {
      id: issueId,
    },
  });

  if (error || !issue) {
    redirect('/admin');
  }

  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className='container mx-auto p-20'>
      <h1 className='text-3xl font-bold'>Edit Issue: {issue[0].title}</h1>
      <LinkButton
        href={'/admin/issues'}
        label='Back to Issues Dashboard'
        Icon={ArrowLeft}
      />
      <EditIssueForm issue={issue[0]} />
    </div>
  );
}
