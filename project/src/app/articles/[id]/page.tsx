import { redirect } from 'next/navigation';

import { queryArticles } from '@/lib/supabase/model/articles';
import { Article } from '@/components/Article';

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
    <div className='container mx-auto py-20'>
      <Article article={data[0]} />
    </div>
  );
}
