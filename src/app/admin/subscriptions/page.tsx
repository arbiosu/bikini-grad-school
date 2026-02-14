import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <section className='mx-auto flex min-h-screen flex-col items-center justify-center gap-8 p-2'>
      <div>
        <h1 className='font-main text-6xl'>todo: fix</h1>
      </div>
      <div>
        <p className='font-fraunces text-lg'>This will be fixed shortly.</p>
      </div>
      <div>
        <Button
          asChild
          className='font-main bg-alt-pink border border-black font-bold text-black'
          size='lg'
        >
          <Link href='/admin/subscriptions/tiers'>manage tiers</Link>
        </Button>
      </div>
      <div>
        <Button
          asChild
          className='font-main bg-alt-pink border border-black font-bold text-black'
          size='lg'
        >
          <Link href='/admin/subscriptions/addons'>manage addons</Link>
        </Button>
      </div>
    </section>
  );
}
