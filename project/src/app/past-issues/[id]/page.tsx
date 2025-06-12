import { redirect } from 'next/navigation';
import { queryIssues } from '@/lib/supabase/model/issues';
import { queryArticles } from '@/lib/supabase/model/articles';
import { IssuePageAlt } from '@/components/Issues';
import { queryPhotoshoots } from '@/lib/supabase/model/photoshoots';
import { ArticleWithContributorName } from '@/lib/supabase/model/types';
import { ArticleChonkText } from '@/components/Chonk';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const issueId = (await params).id;
  const { data: issue, error } = await queryIssues({
    filter: {
      id: issueId,
    },
  });

  if (error || !issue) {
    redirect('/past-issues');
  }

  const [articles, photoshoots] = await Promise.all([
    queryArticles({
      select: [
        '*',
        'contributorName:contributors!articles_contributor_fkey(name)',
      ],
      filter: {
        issueId: issueId,
        published: true,
      },
    }),
    queryPhotoshoots({
      filter: {
        issueId: issueId,
      },
    }),
  ]);

  if (
    articles.error ||
    !articles.data ||
    photoshoots.error ||
    !photoshoots.data
  ) {
    redirect('/past-issues');
  }

  const articlesWithNames = articles.data as ArticleWithContributorName[];

  return (
    <div className='container mx-auto py-20'>
      <ArticleChonkText strings={[issue[0].title]} variant={'small'} />
      <div>
        <IssuePageAlt
          issue={issue[0]}
          issueArticles={articlesWithNames}
          issuePhotoshoots={photoshoots.data}
        />
      </div>
    </div>
  );
}
