import { queryPhotoshoots } from '@/lib/supabase/model/photoshoots';
import { redirect } from 'next/navigation';
import Carousel from '@/components/ImageCarousel';

export default async function PhotoshootPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const photoshootId = (await params).id;
  const { data, error } = await queryPhotoshoots({
    filter: {
      id: photoshootId,
    },
  });

  if (error || !data) {
    redirect('/');
  }

  return (
    <div className='container mx-auto px-4 py-16'>
      <h1 className='mb-6 text-center text-3xl font-bold'>{data[0].title}</h1>

      <div className='mx-auto max-w-3xl overflow-hidden rounded-xl'>
        <Carousel images={data[0].images} />
      </div>
    </div>
  );
}
