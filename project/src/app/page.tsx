import { getCurrentIssue, getIssueArticles } from '@/lib/supabase/model';
import LandingPage from '@/components/LandingPage';
import { ChonkText } from '@/components/Chonk';
import SubscribeCard from '@/components/Subscribe';
import SocialMediaCard from '@/components/SocialMedia';
import ShowMeGrid from '@/components/ShowMe';
import { Issue } from '@/components/Issues';

const imgs = [
  {
    imgUrl: '/content/show-me-articles',
    label: 'articles',
    href: '/articles',
  },
  {
    imgUrl: '/content/show-me-digimedia',
    label: 'digi media',
    href: '/digimedia',
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
  const { data: issue, error } = await getCurrentIssue();
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }
  const { data: articles, error: articlesError } = await getIssueArticles(
    issue[0].id
  );
  if (articlesError) {
    return <p>Articles Error</p>;
  }
  return (
    <main className='mx-auto'>
      <LandingPage />
      <div className='py-10'>
        <ChonkText strings={['CURRENT', 'ISSUE']} variant={'large'} />
        <div className='py-10'>
          <Issue issue={issue[0]} issueArticles={articles} />
        </div>
      </div>
      <div className='py-8'>
        <ChonkText strings={['SHOW', 'ME']} variant={'large'} />
      </div>
      <ShowMeGrid cards={imgs} />
      <div className='py-8'>
        <ChonkText strings={['GET', 'UPDATES']} />
      </div>
      <div className='container mx-auto'>
        <div className='mx-auto grid max-w-3xl md:grid-cols-2'>
          <SubscribeCard />
          <SocialMediaCard />
        </div>
      </div>
    </main>
  );
}
