import { redirect } from 'next/navigation';

import { queryArticles } from '@/lib/supabase/model/articles';
import { Article } from '@/components/Article';
import BGSLogo from '@/components/BGSlogo';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const articleId = (await params).id;
  const { data, error } = await queryArticles({
    filter: {
      id: articleId,
    },
  });

  if (error || !data) {
    redirect('/articles');
  }

  return (
    <div className='container mx-auto py-10'>
      <Article article={data[0]} />
      <div className='flex justify-center p-6'>
        <BGSLogo />
      </div>
    </div>
  );
}
