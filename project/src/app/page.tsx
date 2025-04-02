import LandingPage from '@/components/LandingPage';
import { ChonkText } from '@/components/Chonk';
import SubscribeCard from '@/components/Subscribe';
import SocialMediaCard from '@/components/SocialMedia';
import { ImageOverlayGrid } from '@/components/ImageOverlay';

const imgs = [
  {
    imgUrl: '/content/bgs-4',
    altText: 'EDITORIALS',
    overlayText: ['EDITORIALS'],
    textPosition: 'inset-0 flex items-center justify-center',
    className:
      'aspect-video transition-transform hover:scale-95 focus:scale-95 active:scale-95',
    textSizes: {
      base: 4,
      md: 4,
      lg: 6,
    },
  },
  {
    imgUrl: '/content/bgs-3',
    altText: 'ARTICLES',
    overlayText: ['ARTICLES'],
    textPosition: 'inset-0 flex items-center justify-center',
    className:
      'aspect-video transition-transform hover:scale-95 focus:scale-95 active:scale-95',
    textSizes: {
      base: 4,
      md: 4,
      lg: 6,
    },
  },
  {
    imgUrl: '/content/bgs-2',
    altText: 'DIGI MEDIA',
    overlayText: ['DIGI', 'MEDIA'],
    textPosition: 'inset-0 flex items-center justify-center',
    className:
      'aspect-video transition-transform hover:scale-95 focus:scale-95 active:scale-95',
    textSizes: {
      base: 4,
      md: 4,
      lg: 6,
    },
  },
  {
    imgUrl: '/content/bgs-1',
    altText: 'MERCH',
    overlayText: ['MERCH'],
    textPosition: 'inset-0 flex items-center justify-center',
    className:
      'aspect-video transition-transform hover:scale-95 focus:scale-95 active:scale-95',
    textSizes: {
      base: 4,
      md: 4,
      lg: 6,
    },
  },
];

export default function Home() {
  return (
    <>
      <LandingPage />
      <div className='py-8'></div>
      <ChonkText strings={['SHOW', 'ME']} />
      <ImageOverlayGrid images={imgs} />
      <div className='py-8'></div>
      <ChonkText strings={['GET', 'UPDATES']} />
      <div className="container mx-auto">
        <div className='grid md:grid-cols-2 max-w-3xl mx-auto'>
          <SubscribeCard />
          <SocialMediaCard />
        </div>
      </div>
    </>
  );
}
