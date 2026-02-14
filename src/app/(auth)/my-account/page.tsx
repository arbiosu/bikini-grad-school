import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';
import {
  createSubscriptionService,
  createTierService,
  createAddonProductService,
} from '@/lib/container';
import { AccountSubscription } from '@/components/users/account-subscription';
import { SignOutButton } from '@/components/users/sign-out-button';

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/error');
  }

  if (user.app_metadata.user_role === 'admin') {
    return (
      <section className='min-h-screen'>
        <div className='flex flex-col items-center'>
          <h6>Admin Account</h6>
          <SignOutButton />
        </div>
      </section>
    );
  }

  const serviceClient = await createServiceClient();
  const subscriptionService = createSubscriptionService(serviceClient);
  const tierService = createTierService(serviceClient);
  const addonService = createAddonProductService(serviceClient);

  const subscriptionResult = await subscriptionService.getByUserId(user.id);
  const tiersResult = await tierService.list(true);
  const addonsResult = await addonService.list(true);

  if (!subscriptionResult.success || !tiersResult.success) {
    redirect('/error');
  }

  // Find the tier name for display
  const currentTier = tiersResult.data.find(
    (t) => t.id === subscriptionResult.data.tier_id
  );

  // Map addon IDs to names
  const addonSelections = subscriptionResult.success
    ? subscriptionResult.data.addon_selections.map((s) => {
        const addon = addonsResult.success
          ? addonsResult.data.find((a) => a.id === s.addon_product_id)
          : null;
        return {
          id: s.addon_product_id,
          name: addon?.name ?? 'Unknown add-on',
        };
      })
    : [];

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-16'>
      <div className='mx-auto max-w-2xl'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='mb-1 text-2xl font-bold text-gray-900'>
              My Account
            </h1>
            <p className='text-gray-500'>{user.email}</p>
          </div>
          <SignOutButton />
        </div>

        {subscriptionResult.success ? (
          <AccountSubscription
            subscription={subscriptionResult.data}
            tierName={currentTier?.name ?? 'Unknown tier'}
            addonSelections={addonSelections}
          />
        ) : (
          <div className='rounded-xl border border-gray-200 p-6'>
            <p className='text-gray-600'>
              You don't have an active subscription.
            </p>
            <a
              href='/shop'
              className='mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800'
            >
              View plans
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
