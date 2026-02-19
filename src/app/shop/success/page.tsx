import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <div className='font-main flex min-h-screen items-center justify-center px-4'>
      <div className='max-w-md rounded-xl border p-8 text-center'>
        <div className='flex justify-center'>
          <Image
            src='public/bgs-logo.png'
            alt='Bikini Grad School Logo'
            height={64}
            width={64}
            className='h-16 w-16'
            priority
          />
        </div>
        <h1 className='mb-2 text-2xl font-bold'>Welcome to Zine Club!</h1>
        <p className='mb-4'>
          Your subscription is active. Check your email for a link to set up
          your account. The link is active for 1 hour.
        </p>
        <Button
          asChild
          size='lg'
          className='font-main bg-alt-pink border border-black font-bold text-black'
        >
          <Link href='/'>Go to homepage</Link>
        </Button>
      </div>
    </div>
  );
}
