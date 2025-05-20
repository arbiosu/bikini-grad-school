import { queryPhotoshoots } from '@/lib/supabase/model/photoshoots';
import ImageOverlayCard from '@/components/ImageOverlay';
import PhotoshootGrid from '@/components/Photoshoots';
import MediaNavbar from '@/components/MediaNavbar';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { data: photoshoots, error: photoshootsError } =
    await queryPhotoshoots();

  if (photoshootsError || !photoshoots) {
    redirect('/');
  }

  return (
    <section>
      <div className='py-10'></div>
      <ImageOverlayCard
        imgUrl='/content/features'
        overlayText={['FEATURES']}
        altText='Bikini Grad School: FEATURES'
        aspectRatio={'aspectVideo'}
        textPosition={'left'}
        textSize={'large'}
      />
      <div className='p-10'>
        <MediaNavbar />
      </div>
      <div className='container mx-auto p-10'>
        <PhotoshootGrid photoshoots={photoshoots} />
      </div>
    </section>
  );
}
