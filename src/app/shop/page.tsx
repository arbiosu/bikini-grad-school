import {
  listActiveTiersAction,
  listActiveAddonsAction,
} from '@/actions/subscriptions/tiers';
import { ZineClub } from '@/components/shop/zine-club';

export default async function PricingPage() {
  const [tiersResult, addonsResult] = await Promise.all([
    listActiveTiersAction(),
    listActiveAddonsAction(),
  ]);

  if (!tiersResult.success || !addonsResult.success) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-red-500'>Failed to load pricing information.</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen px-4 py-16'>
      <div className='mx-auto max-w-5xl'>
        <div className='mb-12 flex flex-col gap-8 text-center'>
          <h1 className='font-interlope text-bgs-text text-6xl md:text-8xl lg:text-9xl'>
            Zine Club
          </h1>
          <p className='font-main text-lg sm:text-xl'>
            {"Bikini Grad School's"}{' '}
            <span className='font-bold'>Monthly Snail Mail Club</span>
          </p>
        </div>
        <ZineClub tiers={tiersResult.data} addons={addonsResult.data} />
      </div>
    </div>
  );
}
