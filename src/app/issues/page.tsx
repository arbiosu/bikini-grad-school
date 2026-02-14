import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <section className='mx-auto flex min-h-screen flex-col items-center justify-center gap-8 p-2'>
      <div>
        <h1 className='font-main text-6xl'>
          Temporarily down for maintenance :/
        </h1>
      </div>
      <div>
        <p className='font-fraunces text-lg'>
          Our content will be back shortly. In the meantime, check out Zine
          Club!
        </p>
      </div>
      <div>
        <Button
          asChild
          className='font-main bg-alt-pink border border-black font-bold text-black'
          size='lg'
        >
          <Link href='/shop'>zine club</Link>
        </Button>
      </div>
    </section>
  );
}
