import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAllIssues } from '@/lib/supabase/model';
import IssueAdminGrid from '@/components/admin/Issue';
import LinkButton from '@/components/admin/LinkButton';
import { ArrowLeft } from 'lucide-react';

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log('Auth Error:', error);
    redirect('/admin/login');
  }
  const { data: issues, error: dbError } = await getAllIssues();

  if (dbError) {
    return (
      <h1 className='text-center text-2xl'>
        Error retrieving issues from database.
      </h1>
    );
  }

  return (
    <div className='container mx-auto p-20'>
      <h1 className='mx-4 text-center text-5xl font-bold'>
        Admin Dashboard - Issues
      </h1>
      <div className='p-2'>
        <LinkButton
          href={'/admin'}
          label='Back to Admin Dashboard'
          Icon={ArrowLeft}
        />
      </div>
      <IssueAdminGrid issues={issues} />
    </div>
  );
}
