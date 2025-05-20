import { redirect } from 'next/navigation';
import { queryIssues } from '@/lib/supabase/model/issues';
import { queryArticles } from '@/lib/supabase/model/articles';
import LandingPage from '@/components/LandingPage';
import { ChonkText } from '@/components/Chonk';
import SubscribeCard from '@/components/Subscribe';
import SocialMediaCard from '@/components/SocialMedia';
import ShowMeGrid from '@/components/ShowMe';
import { IssuePage } from '@/components/Issues';
import { queryPhotoshoots } from '@/lib/supabase/model/photoshoots';
import { ArticleWithContributorName } from '@/lib/supabase/model/types';

const imgs = [
  {
    imgUrl: '/content/show-me-articles',
    label: 'articles',
    href: '/articles',
  },
  {
    imgUrl: '/content/show-me-features',
    label: 'features',
    href: '/features',
  },
  {
    imgUrl: '/content/show-me-shop',
    label: 'shop',
    href: '/shop',
  },
];

export default async function Home() {
  const { data: issue, error: issueError } = await queryIssues({
    filter: {
      published: true,
    },
    sort: {
      column: 'publication_date',
      order: 'desc',
    },
    limit: 1,
  });

  if (issueError || !issue) {
    redirect('/error');
  }

  const { data: articles, error: articlesError } = await queryArticles({
    select: [
      '*',
      'contributorName:contributors!articles_contributor_fkey(name)',
    ],
    filter: {
      issueId: issue[0].id,
      published: true,
    },
  });

  const { data: photoshoots, error: photoshootsError } = await queryPhotoshoots(
    {
      filter: {
        issueId: issue[0].id,
      },
    }
  );

  if (articlesError || photoshootsError || !photoshoots || !articles) {
    redirect('/error');
  }
  const articlesWithNames = articles as ArticleWithContributorName[];
  return (
    <main className='mx-auto'>
      <LandingPage />
      <div className='py-10'>
        <ChonkText strings={['CURRENT', 'ISSUE']} variant={'large'} />
        <div className='py-10'>
          <IssuePage
            issue={issue[0]}
            issueArticles={articlesWithNames}
            issuePhotoshoots={photoshoots}
          />
        </div>
      </div>
      <div className='py-8'>
        <ChonkText strings={['SHOW', 'ME']} variant={'large'} />
      </div>
      <ShowMeGrid cards={imgs} />
      <div className='flex justify-center py-20'>
        <ChonkText strings={['GET', 'UPDATES']} />
      </div>
      <div className='mx-auto grid max-w-3xl md:grid-cols-2'>
        <SubscribeCard />
        <SocialMediaCard />
      </div>
    </main>
  );
}
