'use client';

import { useState } from 'react';
import type { FullSubscription } from '@/domain/subscriptions/types';

interface AddonDisplay {
  id: string;
  name: string;
}

interface AdminAccountSubscriptionProps {
  subscription: FullSubscription;
  tierName: string;
  addonSelections: AddonDisplay[];
}

export function AdminAccountSubscription({
  subscription,
  tierName,
  addonSelections,
}: AdminAccountSubscriptionProps) {
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(
    subscription.cancel_at_period_end
  );

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function getStatusDisplay(status: string, canceling: boolean) {
    if (canceling) {
      return { label: 'Canceling', className: 'bg-amber-100 text-amber-700' };
    }
    switch (status) {
      case 'active':
        return { label: 'Active', className: 'bg-green-100 text-green-700' };
      case 'trialing':
        return { label: 'Trial', className: 'bg-blue-100 text-blue-700' };
      case 'past_due':
        return { label: 'Past due', className: 'bg-red-100 text-red-700' };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-700' };
    }
  }

  const status = getStatusDisplay(subscription.status, cancelAtPeriodEnd);

  return (
    <div className='font-main space-y-6'>
      {/* Profile Details */}
      <div className='rounded-xl border p-6'>
        <h2 className='mb-4 text-lg font-semibold'>Profile</h2>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-sm'>Display name</span>
            <span className='text-sm font-medium'>
              {subscription.profiles.display_name || '—'}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm'>User ID</span>
            <span className='font-mono text-sm'>
              {subscription.profiles.id}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm'>Stripe customer ID</span>
            <span className='font-mono text-sm'>
              {subscription.profiles.stripe_customer_id || '—'}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm'>Account claimed</span>
            <span className='text-sm'>
              {formatDate(subscription.profiles.account_claimed_at)}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm'>Created</span>
            <span className='text-sm'>
              {formatDate(subscription.profiles.created_at)}
            </span>
          </div>
        </div>
      </div>
      {/* Subscription Details */}
      <div className='rounded-xl border p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Subscription</h2>
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-sm'>Plan</span>
            <span className='text-sm font-medium'>{tierName}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm'>Current period</span>
            <span className='text-sm'>
              {formatDate(subscription.current_period_start)} —{' '}
              {formatDate(subscription.current_period_end)}
            </span>
          </div>
          {cancelAtPeriodEnd && (
            <div className='flex justify-between'>
              <span className='text-sm text-gray-500'>Ends on</span>
              <span className='text-sm font-medium text-red-600'>
                {formatDate(subscription.current_period_end)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Addon Selections */}
      {addonSelections.length > 0 && (
        <div className='rounded-xl border p-6'>
          <h2 className='mb-4 text-lg font-semibold'>Subscription add-ons</h2>
          <div className='space-y-2'>
            {addonSelections.map((addon) => (
              <div key={addon.id} className='flex items-center gap-2 text-sm'>
                <span className='bg-primary h-1.5 w-1.5 rounded-full' />
                {addon.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
