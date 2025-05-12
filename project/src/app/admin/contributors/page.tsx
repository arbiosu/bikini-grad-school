import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { queryContributors } from '@/lib/supabase/model/contributors';
import ContributorAdminGrid from '@/components/admin/Contributor';
import LinkButton from '@/components/admin/LinkButton';
import { ArrowLeft } from 'lucide-react';

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log('Auth Error:', error);
    redirect('/admin/login');
  }

  const {
    data: contributors,
    count,
    error: dbError,
  } = await queryContributors();

  if (dbError || !contributors) {
    console.log(error);
    return (
      <h1 className='text-center text-2xl'>Failed to retireve articles</h1>
    );
  }

  return (
    <div className='container mx-auto p-20'>
      <h1 className='mx-4 text-center text-5xl font-bold'>
        Admin Dashboard - Total Contributors {count}
      </h1>
      <div className='p-2'>
        <LinkButton
          href={'/admin'}
          label='Back to Admin Dashboard'
          Icon={ArrowLeft}
        />
      </div>
      <ContributorAdminGrid contributors={contributors} />
    </div>
  );
}
