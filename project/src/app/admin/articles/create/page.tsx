import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { queryIssues } from '@/lib/supabase/model/issues';
import CreateNewArticleForm from '@/components/admin/CreateArticleForm';
import LinkButton from '@/components/admin/LinkButton';
import { ArrowLeft } from 'lucide-react';

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log('Auth Error:', error);
    redirect('/admin/login');
  }

  const { data: issues, error: dbError } = await queryIssues();
  if (dbError || !issues) {
    return <p>No issues found.</p>;
  }

  return (
    <div className='container mx-auto p-20'>
      <h1 className='text-3xl'>Create a new article</h1>
      <LinkButton
        href={'/admin'}
        label='Back to Admin Dashboard'
        Icon={ArrowLeft}
      />
      <CreateNewArticleForm issues={issues} />
    </div>
  );
}
