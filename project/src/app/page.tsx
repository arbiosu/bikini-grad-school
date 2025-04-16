import LandingPage from '@/components/LandingPage';
import { ChonkText } from '@/components/Chonk';
import SubscribeCard from '@/components/Subscribe';
import SocialMediaCard from '@/components/SocialMedia';
import ShowMeGrid from '@/components/ShowMe';

const imgs = [
  {
    imgUrl: '/content/show-me-articles',
    label: 'articles',
  },
  {
    imgUrl: '/content/show-me-digimedia',
    label: 'digi media',
  },
  {
    imgUrl: '/content/show-me-features',
    label: 'features',
  },
  {
    imgUrl: '/content/show-me-shop',
    label: 'shop',
  },
];

export default function Home() {
  return (
    <main>
      <LandingPage />
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
