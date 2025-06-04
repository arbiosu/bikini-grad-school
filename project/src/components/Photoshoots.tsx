import Link from 'next/link';
import Image from './Image';
import Grid from './Grid';
import { ImageCarousel } from './ImageCarousel';
import type { Photoshoot } from '@/lib/supabase/model/types';

export function Photoshoot({ photoshoot }: { photoshoot: Photoshoot }) {
  return <ImageCarousel images={photoshoot.images} />;
}

export function PhotoshootCard({ photoshoot }: { photoshoot: Photoshoot }) {
  return (
    <Link
      href={`/photoshoots/${photoshoot.id}`}
      className='block h-full'
      target='_blank'
      rel='noopener noreferrer'
    >
      <div className='mx-auto flex h-full flex-col items-center justify-center text-center hover:underline'>
        <div className='relative mx-auto mb-4 aspect-square w-full max-w-lg'>
          <Image
            baseUrl={photoshoot.images[0]}
            alt={`${photoshoot.title}`}
            className='aspect-square h-full w-full object-contain'
          />
        </div>

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
