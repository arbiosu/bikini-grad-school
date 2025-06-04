import { redirect } from 'next/navigation';
import { queryArticles } from '@/lib/supabase/model/articles';
import { queryIssues } from '@/lib/supabase/model/issues';
import { Article } from '@/components/Article';
import { queryContributors } from '@/lib/supabase/model/contributors';

export default async function ArticlePage({
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

  const [issue, contributor] = await Promise.all([
    queryIssues({
      filter: {
        id: data[0].issue_id,
      },
    }),
    queryContributors({
      filter: {
        id: data[0].contributor ? data[0].contributor : undefined,
      },
    }),
  ]);

  if (issue.error || !issue.data || contributor.error || !contributor.data) {
    redirect('/articles');
  }

  return (
    <div className='container mx-auto py-20'>
      <Article
        article={data[0]}
        issue={issue.data[0]}
        contributor={contributor.data[0]}
      />
    </div>
  );
}
