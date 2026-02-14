import Link from 'next/link';
import { Button } from './ui/button';

export default function VideoHero() {
  return (
    <div className='relative min-h-screen w-full'>
      <div className='absolute inset-0 h-full w-full overflow-hidden'>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          className='h-full w-full object-cover'
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL!}/videos/bgs-compressed.mp4`}
            type='video/mp4'
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className='absolute inset-0 mx-8 flex flex-col items-center justify-center gap-8'>
        <h1 className='text-5xl text-white md:py-20 md:text-8xl lg:px-40'>
          <div className='mx-auto'>
            <span className='font-chonk chonk-shadow block text-center'>
              BIKINI
            </span>
            <span className='font-chonk chonk-shadow block text-center'>
              GRAD
            </span>
            <span className='font-chonk chonk-shadow block text-center'>
              SCHOOl
            </span>
          </div>
        </h1>
        <Button
          asChild
          className='font-main bg-alt-pink border border-black font-bold text-black'
          size='lg'
        >
          <Link href='/shop'>snail mail club</Link>
        </Button>
      </div>
    </div>
  );
}
