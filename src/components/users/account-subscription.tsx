'use client';

import { useState } from 'react';
import {
  cancelSubscriptionAction,
  reactivateSubscriptionAction,
} from '@/actions/subscriptions/subscriptions';
import type { SubscriptionWithAddons } from '@/domain/subscriptions/types';

interface AddonDisplay {
  id: string;
  name: string;
}

interface AccountSubscriptionProps {
  userId: string;
  subscription: SubscriptionWithAddons;
  tierName: string;
  addonSelections: AddonDisplay[];
}

export function AccountSubscription({
  subscription,
  tierName,
  addonSelections,
}: AccountSubscriptionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
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

  async function handleCancel() {
    setIsLoading(true);
    setError(null);

    const result = await cancelSubscriptionAction();

    if (!result.success) {
      setError(result.error.message);
    } else {
      setCancelAtPeriodEnd(true);
      setShowCancelConfirm(false);
    }

    setIsLoading(false);
  }

  async function handleReactivate() {
    setIsLoading(true);
    setError(null);

    const result = await reactivateSubscriptionAction();

    if (!result.success) {
      setError(result.error.message);
    } else {
      setCancelAtPeriodEnd(false);
    }

    setIsLoading(false);
  }

  const status = getStatusDisplay(subscription.status, cancelAtPeriodEnd);

  return (
    <div className='space-y-6'>
      {/* Subscription Details */}
      <div className='rounded-xl border border-gray-200 bg-white p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>Subscription</h2>
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-sm text-gray-500'>Plan</span>
            <span className='text-sm font-medium text-gray-900'>
              {tierName}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-gray-500'>Current period</span>
            <span className='text-sm text-gray-900'>
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
        <div className='rounded-xl border border-gray-200 bg-white p-6'>
          <h2 className='mb-4 text-lg font-semibold text-gray-900'>
            Your add-ons
          </h2>
          <div className='space-y-2'>
            {addonSelections.map((addon) => (
              <div
                key={addon.id}
                className='flex items-center gap-2 text-sm text-gray-900'
              >
                <span className='h-1.5 w-1.5 rounded-full bg-gray-900' />
                {addon.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel / Reactivate */}
      <div className='rounded-xl border border-gray-200 bg-white p-6'>
        <h2 className='mb-2 text-lg font-semibold text-gray-900'>
          Manage subscription
        </h2>

        {error && (
          <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        {cancelAtPeriodEnd ? (
          <div>
            <p className='mb-4 text-sm text-gray-600'>
              Your subscription is set to cancel at the end of your current
              billing period. You'll still have access until{' '}
              <span className='font-medium'>
                {formatDate(subscription.current_period_end)}
              </span>
              .
            </p>
            <button
              onClick={handleReactivate}
              disabled={isLoading}
              className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50'
            >
              {isLoading ? 'Processing...' : 'Keep my subscription'}
            </button>
          </div>
        ) : showCancelConfirm ? (
          <div>
            <p className='mb-4 text-sm text-gray-600'>
              Are you sure? You'll lose access to your magazine and add-ons at
              the end of your current billing period.
            </p>
            <div className='flex gap-2'>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className='rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50'
              >
                {isLoading ? 'Processing...' : 'Yes, cancel'}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={isLoading}
                className='rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
              >
                Never mind
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className='mb-4 text-sm text-gray-600'>
              If you cancel, you'll keep access until the end of your current
              billing period.
            </p>
            <button
              onClick={() => setShowCancelConfirm(true)}
              className='rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
            >
              Cancel subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
