import { getArticleById } from '@/lib/supabase/model';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { EditArticleForm } from '@/components/Admin';

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
    <main className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-5xl font-bold text-custom-pink-text'>
        Edit Article {data.title}
      </h1>
      <EditArticleForm article={data} />
    </main>
  );
}
