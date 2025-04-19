import { getArticleById } from '@/lib/supabase/model';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditArticleForm from '@/components/admin/EditArticleForm';
import LinkButton from '@/components/admin/LinkButton';
import { ArrowLeft } from 'lucide-react';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const articleId = (await params).id;
  const { data, error } = await getArticleById(articleId);

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
      <h1 className='text-3xl font-bold'>Edit Article: {data.title}</h1>
      <LinkButton
        href={'/admin/articles'}
        label='Back to Articles Dashboard'
        Icon={ArrowLeft}
      />
      <EditArticleForm article={data} />
    </div>
  );
}
