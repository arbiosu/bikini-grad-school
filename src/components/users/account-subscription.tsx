'use client';

import { useState } from 'react';
import {
  cancelSubscriptionAction,
  reactivateSubscriptionAction,
  swapAddonsAction,
} from '@/actions/subscriptions/subscriptions';
import type { SubscriptionWithAddons } from '@/domain/subscriptions/types';

interface AddonDisplay {
  id: string;
  name: string;
}

interface AddonProduct {
  id: string;
  name: string;
  description?: string | null;
}

interface AccountSubscriptionProps {
  subscription: SubscriptionWithAddons;
  tierName: string;
  addonSelections: AddonDisplay[];
  availableAddons: AddonProduct[];
  addonSlots: number;
}

export function AccountSubscription({
  subscription,
  tierName,
  addonSelections,
  availableAddons,
  addonSlots,
}: AccountSubscriptionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(
    subscription.cancel_at_period_end
  );

  // Addon swap state
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(
    addonSelections.map((a) => a.id)
  );
  // Track current confirmed selections for display
  const [currentAddonIds, setCurrentAddonIds] = useState<string[]>(
    addonSelections.map((a) => a.id)
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

  function handleAddonToggle(addonId: string) {
    setSelectedAddonIds((prev) => {
      if (prev.includes(addonId)) {
        return prev.filter((id) => id !== addonId);
      }
      if (prev.length >= addonSlots) {
        // Replace the last selected if at limit
        return [...prev.slice(0, addonSlots - 1), addonId];
      }
      return [...prev, addonId];
    });
  }

  function handleCancelSwap() {
    setIsSwapping(false);
    setSelectedAddonIds(currentAddonIds);
    setSwapError(null);
  }

  async function handleSaveSwap() {
    if (selectedAddonIds.length !== addonSlots) {
      setSwapError(
        `Please select exactly ${addonSlots} add-on${addonSlots !== 1 ? 's' : ''}.`
      );
      return;
    }

    setSwapLoading(true);
    setSwapError(null);

    const result = await swapAddonsAction({
      addonProductIds: selectedAddonIds,
    });

    if (!result.success) {
      console.log(result.error);
      setSwapError(result.error.message);
    } else {
      setCurrentAddonIds(selectedAddonIds);
      setIsSwapping(false);
    }

    setSwapLoading(false);
  }

  const status = getStatusDisplay(subscription.status, cancelAtPeriodEnd);
  const currentAddons = availableAddons.filter((a) =>
    currentAddonIds.includes(a.id)
  );

  return (
    <div className='font-main space-y-6'>
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
      {addonSlots > 0 && (
        <div className='rounded-xl border p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold'>Your add-ons</h2>
              <p className='mt-0.5 text-xs text-gray-500'>
                {addonSlots} slot{addonSlots !== 1 ? 's' : ''} included with
                your plan
              </p>
            </div>
            {!isSwapping && (
              <button
                onClick={() => setIsSwapping(true)}
                className='rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50'
              >
                Change add-ons
              </button>
            )}
          </div>

          {isSwapping ? (
            <div className='space-y-4'>
              <p className='text-sm text-gray-600'>
                Select {addonSlots} add-on{addonSlots !== 1 ? 's' : ''} from the
                options below.
              </p>

              <div className='space-y-2'>
                {availableAddons.map((addon) => {
                  const isSelected = selectedAddonIds.includes(addon.id);
                  const isDisabled =
                    !isSelected && selectedAddonIds.length >= addonSlots;

                  return (
                    <button
                      key={addon.id}
                      onClick={() => handleAddonToggle(addon.id)}
                      disabled={isDisabled}
                      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                        isSelected
                          ? 'border-gray-900 bg-gray-50'
                          : isDisabled
                            ? 'cursor-not-allowed border-gray-100 opacity-40'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? 'border-gray-900 bg-gray-900'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className='h-2.5 w-2.5 text-white'
                            viewBox='0 0 10 8'
                            fill='none'
                          >
                            <path
                              d='M1 4l3 3 5-6'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        )}
                      </div>

                      <div>
                        <p className='text-sm font-medium'>{addon.name}</p>
                        {addon.description && (
                          <p className='mt-0.5 text-xs text-gray-500'>
                            {addon.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selection count indicator */}
              <div className='flex items-center gap-1.5'>
                {Array.from({ length: addonSlots }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-colors ${
                      i < selectedAddonIds.length
                        ? 'bg-gray-900'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
                <span className='ml-1 text-xs text-gray-500'>
                  {selectedAddonIds.length}/{addonSlots} selected
                </span>
              </div>

              {swapError && (
                <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
                  {swapError}
                </div>
              )}

              <div className='flex gap-2'>
                <button
                  onClick={handleSaveSwap}
                  disabled={
                    swapLoading || selectedAddonIds.length !== addonSlots
                  }
                  className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50'
                >
                  {swapLoading ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  onClick={handleCancelSwap}
                  disabled={swapLoading}
                  className='rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : currentAddons.length > 0 ? (
            <div className='space-y-2'>
              {currentAddons.map((addon) => (
                <div key={addon.id} className='flex items-center gap-2 text-sm'>
                  <span className='bg-primary h-1.5 w-1.5 rounded-full' />
                  {addon.name}
                </div>
              ))}
            </div>
          ) : (
            <p className='text-sm text-gray-500'>No add-ons selected.</p>
          )}
        </div>
      )}

      {/* Cancel / Reactivate */}
      <div className='rounded-xl border p-6'>
        <h2 className='mb-2 text-lg font-semibold'>Manage subscription</h2>

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
              className='rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50'
            >
              Cancel subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
