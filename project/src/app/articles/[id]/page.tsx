import { redirect } from 'next/navigation';

import { queryArticles } from '@/lib/supabase/model/articles';
import { queryIssues } from '@/lib/supabase/model/issues';
import { Article } from '@/components/Article';
import { queryContributors } from '@/lib/supabase/model/contributors';

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
  const { data: issue, error: issueError } = await queryIssues({
    filter: {
      id: data[0].issue_id,
    },
  });

  if (issueError || !issue) {
    redirect('/articles');
  }

  const { data: contributor, error: contributorError } =
    await queryContributors({
      filter: {
        id: data[0].contributor ? data[0].contributor : undefined,
      },
    });
  if (contributorError || !contributor) {
    redirect('/articles');
  }
  console.log('CONTRIBUTORS: ', contributor);

  return (
    <div className='container mx-auto py-20'>
      <Article
        article={data[0]}
        issue={issue[0]}
        contributor={contributor[0]}
      />
    </div>
  );
}
