import ImageOverlayCard from '@/components/ImageOverlay';
import TextBlock from '@/components/TextBlock';

export default async function Page() {
  return (
    <section>
      <div className='py-20'>
        <ImageOverlayCard
          imgUrl='/content/features-bg'
          overlayText={['FEATURES']}
          altText='Bikini Grad School: FEATURES'
          aspectRatio={'aspectVideo'}
          textPosition={'left'}
          textSize={'large'}
        />
      </div>
      <div className='p-10'></div>
      <TextBlock heading='Coming Soon' subheading='' />
    </section>
  );
}
