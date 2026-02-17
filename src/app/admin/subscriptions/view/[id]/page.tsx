import { redirect } from 'next/navigation';
import { getSubscriptionByStripeId } from '@/actions/subscriptions/subscriptions';
import { listActiveAddonsAction } from '@/actions/subscriptions/tiers';
import { listActiveTiersAction } from '@/actions/subscriptions/tiers';

import BackButton from '@/components/back-button';
import { AdminAccountSubscription } from '@/components/admin/full-subscription';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const result = await getSubscriptionByStripeId(id);

  if (!result.success) {
    redirect('/admin/error');
  }

  const [tiers, addons] = await Promise.all([
    listActiveTiersAction(),
    listActiveAddonsAction(),
  ]);

  if (!tiers.success || !addons.success) {
    redirect('/admin/error');
  }

  const currentTier = tiers.data.find((t) => t.id === result.data.tier_id);
  const addonSelections = result.data.addon_selections.map((s) => {
    const addon = addons.data.find((a) => a.id === s.addon_product_id);
    return {
      id: s.addon_product_id,
      name: addon?.name ?? 'Unknown Name',
    };
  });

  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/subscriptions/' label='Back' />
      </div>
      <div className='mx-auto w-full max-w-7xl'>
        <AdminAccountSubscription
          subscription={result.data}
          tierName={currentTier?.name ?? 'Unknown TIer'}
          addonSelections={addonSelections}
        />
      </div>
    </section>
  );
}
