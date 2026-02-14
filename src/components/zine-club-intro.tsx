import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';

export default function ZineClubIntro() {
  return (
    <section className='flex flex-col gap-8 px-2 py-10'>
      <div>
        <h6 className='font-chonk chonk-shadow text-center text-5xl text-white md:text-7xl'>
          <span className='font-chonk chonk-shadow mb-4 block text-center'>
            BGS ZINE CLUB
          </span>
        </h6>
      </div>
      <div>
        {' '}
        <p className='font-main text-center'>
          {"Bikini Grad School's"}
          <span className='font-bold'> Snail Mail Club</span>
        </p>
      </div>
      <div>
        <div className='mx-auto grid grid-cols-1 items-center justify-items-center gap-2 md:grid-cols-2'>
          <div className='flex flex-col gap-8'>
            <p className='font-main text-2xl font-bold'>
              get monthly zine mail
            </p>
            <div>
              <p className='font-main max-w-lg text-lg'>
                BGS Zine Club is a monthly snail mail subscription service. You
                can choose zines from a variety of girly topics to receive
                monthly in your mailbox for less than a latte.
              </p>
            </div>
            <div>
              <Button
                asChild
                className='font-main bg-alt-pink border border-black font-bold text-black'
                size='lg'
              >
                <Link href='/shop'>snail mail</Link>
              </Button>
            </div>
          </div>
          <div>
            <div className='relative flex-1'>
              <Image
                src={`/public/zine-club-zine-queen.png`}
                alt='Bikini Grad School Zine Club'
                width={400}
                height={400}
                quality={75}
                className='h-auto w-full max-w-lg rounded-xl object-cover'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
