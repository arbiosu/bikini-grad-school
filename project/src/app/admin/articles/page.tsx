import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAllArticles } from '@/lib/supabase/model';
import ArticleAdminGrid from '@/components/admin/Article';
import LinkButton from '@/components/admin/LinkButton';
import { ArrowLeft } from 'lucide-react';

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log('Auth Error:', error);
    redirect('/admin/login');
  }

  const { data: articles, error: dbError } = await getAllArticles();

  if (dbError) {
    return (
      <h1 className='text-center text-2xl'>Failed to retireve articles</h1>
    );
  }

  return (
    <div className='container mx-auto p-20'>
      <h1 className='mx-4 text-center text-5xl font-bold'>
        Admin Dashboard - Articles
      </h1>
      <div className='p-2'>
        <LinkButton
          href={'/admin'}
          label='Back to Admin Dashboard'
          Icon={ArrowLeft}
        />
      </div>
      <ArticleAdminGrid articles={articles} />
    </div>
  );
}
