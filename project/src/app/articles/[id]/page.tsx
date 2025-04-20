import { getArticleById } from '@/lib/supabase/model';
import { redirect } from 'next/navigation';
import { Article } from '@/components/Article';
import BGSLogo from '@/components/BGSlogo';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const articleId = (await params).id;
  const { data, error } = await getArticleById(articleId);

  if (error || !data) {
    redirect('/articles');
  }

  return (
    <div className='container mx-auto py-10'>
      <Article article={data} />
      <div className='flex justify-center p-6'>
        <BGSLogo />
      </div>
    </div>
  );
}
