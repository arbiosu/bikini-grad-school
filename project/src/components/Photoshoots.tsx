import Link from 'next/link';
import Image from './Image';
import Grid from './Grid';
import Carousel from './ImageCarousel';
import type { Photoshoot } from '@/lib/supabase/model/types';

export function Photoshoot({ photoshoot }: { photoshoot: Photoshoot }) {
  return <Carousel images={photoshoot.images} />;
}

export function PhotoshootCard({ photoshoot }: { photoshoot: Photoshoot }) {
  return (
    <Link href={`/photoshoots/${photoshoot.id}`}>
      <div className='mx-auto flex h-full flex-col items-center justify-center text-center hover:underline'>
        <Image
          baseUrl={photoshoot.images[0]}
          alt={`${photoshoot.title}`}
          className='mb-4'
          widths={['320']}
          sizes='320px'
        />
        <p className='text-xl'>{photoshoot.title}</p>
      </div>
    </Link>
  );
}

export default function PhotoshootGrid({
  photoshoots,
}: {
  photoshoots: Photoshoot[];
}) {
  return (
    <Grid
      items={photoshoots}
      renderItem={(photoshoot) => <PhotoshootCard photoshoot={photoshoot} />}
      variant={'large'}
    />
  );
}
