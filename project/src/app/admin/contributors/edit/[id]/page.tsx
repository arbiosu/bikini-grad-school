import { queryContributors } from '@/lib/supabase/model/contributors';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditContributorForm from '@/components/admin/EditContributorForm';
import LinkButton from '@/components/admin/LinkButton';
import { ArrowLeft } from 'lucide-react';

export default async function EditContributorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const contributorId = (await params).id;
  const { data, error } = await queryContributors({
    filter: {
      id: contributorId,
    },
  });

  if (error || !data) {
    redirect('/admin');
  }

  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className='container mx-auto p-20'>
      <h1 className='text-3xl font-bold'>Edit Contributor</h1>
      <LinkButton
        href={'/admin/contributors'}
        label={'Back to Contributors Dashboard'}
        Icon={ArrowLeft}
      />
      <EditContributorForm contributor={data[0]} />
    </div>
  );
}
