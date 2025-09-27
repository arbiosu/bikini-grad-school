import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <section className='min-h-screen px-4'>
      <div className='flex min-h-screen flex-col items-center justify-center gap-8 xl:flex-row'>
        <div className='flex flex-col justify-center'>
          <h1 className='font-chonk chonk-shadow text-center text-4xl text-white sm:text-5xl md:text-6xl xl:text-8xl'>
            <p>BIKINI</p>
            <p>GRAD</p>
            <p>SCHOOL</p>
          </h1>
          <p className='font-main mt-4 p-2 text-center text-2xl'>
            a magazine for women and queer people.
          </p>
          <div className='font-main flex flex-col items-center justify-center gap-2'>
            <Button asChild className='bg-bgs-pink w-1/2 text-xl text-black'>
              <Link href='/'>Shop</Link>
            </Button>
            <Button asChild className='bg-bgs-pink w-1/2 text-xl text-black'>
              <Link href='/'>Past Issues</Link>
            </Button>
            <Button asChild className='bg-bgs-pink w-1/2 text-xl text-black'>
              <Link href='/'>Current Issue</Link>
            </Button>
          </div>
        </div>

        <div className='flex max-w-full items-center overflow-hidden'>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload='auto'
            className='border-bgs-pink rounded border-1'
          >
            <source src='/bgs-compressed.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
