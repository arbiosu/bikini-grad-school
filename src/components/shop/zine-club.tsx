'use client';

import Image from 'next/image';
import { useState } from 'react';
import { createCheckoutAction } from '@/actions/subscriptions/subscriptions';
import type {
  TierWithPrices,
  AddonProduct,
} from '@/domain/subscriptions/types';

import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardHeader,
} from '../ui/card';
import { Button } from '../ui/button';

interface ZineClubProps {
  tiers: TierWithPrices[];
  addons: AddonProduct[];
}

export function ZineClub({ tiers, addons }: ZineClubProps) {
  const [selectGetStarted, setSelectGetStarted] = useState<boolean>(false);
  const [interval, setInterval] = useState<'month' | 'year'>('month');
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTier = tiers.find((t) => t.id === selectedTierId);

  function toggleAddon(addonId: string) {
    if (!selectedTier) return;

    setSelectedAddonIds((prev) => {
      if (prev.includes(addonId)) {
        return prev.filter((id) => id !== addonId);
      }
      if (prev.length >= selectedTier.addon_slots) {
        return prev;
      }
      return [...prev, addonId];
    });
  }

  function selectTier(tierId: string) {
    setSelectedTierId(tierId);
    setSelectedAddonIds([]);
    setError(null);
  }

  function getPrice(tier: TierWithPrices): number {
    const price = tier.prices.find(
      (p) => p.interval === interval && p.is_active
    );
    return price?.amount ?? 0;
  }

  function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  async function handleCheckout() {
    if (!selectedTier) return;

    if (selectedAddonIds.length !== selectedTier?.addon_slots) {
      setError(`Please select exactly ${selectedTier.addon_slots} add-on(s)`);
    }

    setIsLoading(true);
    setError(null);

    const result = await createCheckoutAction({
      tierId: selectedTier.id,
      interval,
      addonProductIds: selectedAddonIds,
      successUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/`,
    });

    if (!result.success) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    window.location.href = result.data.url;
  }

  return (
    <div className='text-bgs-text mx-auto max-w-5xl'>
      {!selectGetStarted && (
        <div className='flex flex-col items-center gap-8 text-center'>
          <h6 className='font-interlope text-6xl md:text-8xl lg:text-9xl'>
            How It Works
          </h6>
          <div className='font-fraunces flex justify-center gap-8'>
            <p className='text-sm md:text-xl'>1. Pick Your Tier</p>
            <p className='text-sm md:text-xl'>2. Choose your zines</p>
            <p className='text-sm md:text-xl'>3. Sign up</p>
          </div>
          <Button
            size='lg'
            onClick={() => setSelectGetStarted(true)}
            className='border-primary bg-bgs-pink font-main border text-black'
          >
            Get Started
          </Button>
        </div>
      )}

      {selectGetStarted && (
        <div className='flex flex-col gap-8'>
          <div className='font-fraunces'>
            <p className='text-xl md:text-2xl'>Step One</p>
            <h6 className='font-interlope text-center text-6xl md:text-7xl'>
              Pick Your Tier
            </h6>
          </div>

          {/* Interval Toggle */}
          <div className='font-main flex justify-center'>
            <div className='inline-flex rounded-lg border border-gray-200 p-1'>
              <button
                onClick={() => setInterval('month')}
                className={`rounded-md px-4 py-2 text-lg text-black transition-colors ${
                  interval === 'month' ? 'bg-bgs-pink' : 'text-primary'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setInterval('year')}
                className={`rounded-md px-4 py-2 text-lg text-black transition-colors ${
                  interval === 'year' ? 'bg-bgs-pink' : 'text-primary'
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {tiers.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              const price = getPrice(tier);

              return (
                <button
                  key={tier.id}
                  onClick={() => selectTier(tier.id)}
                  className={`flex flex-col gap-2 rounded-4xl border-2 p-6 text-left transition-all ${
                    isSelected
                      ? 'border-primary shadow-md'
                      : 'border-secondary hover:border-gray-300'
                  }`}
                >
                  <h3 className='font-interlope text-bgs-text text-center text-4xl'>
                    {tier.name}
                  </h3>
                  <p className='font-fraunces text-xl'>
                    You receive{' '}
                    {tier.addon_slots > 0 &&
                      `${tier.addon_slots} zine${tier.addon_slots > 1 ? 's' : ''} per month.`}
                  </p>
                  {tier.description && (
                    <p className='text-sm'>{tier.description}</p>
                  )}
                  <p className='text-2xl font-bold'>
                    {formatPrice(price)}
                    <span className='text-sm font-normal'>
                      /{interval === 'month' ? 'mo' : 'yr'}
                    </span>
                  </p>
                </button>
              );
            })}
          </div>

          {selectedTier && selectedTier.addon_slots > 0 && (
            <div className='flex flex-col gap-6'>
              <p className='font-fraunces text-xl md:text-2xl'>Step Two</p>
              <div className='flex flex-col gap-4'>
                <div className='text-center'>
                  <h6 className='font-interlope text-bgs-text mb-4 text-6xl md:text-7xl'>
                    Pick Your Series
                  </h6>
                  <p className='mt-1 text-sm text-gray-500'>
                    Select {selectedTier.addon_slots} of {addons.length}{' '}
                    available ({selectedAddonIds.length}/
                    {selectedTier.addon_slots} selected)
                  </p>
                </div>

                <div className='grid grid-cols-1 gap-3'>
                  {addons.map((addon, index) => {
                    const isSelected = selectedAddonIds.includes(addon.id);
                    const isDisabled =
                      !isSelected &&
                      selectedAddonIds.length >= selectedTier.addon_slots;
                    const isEven = index % 2 === 0;

                    return (
                      <Card
                        key={addon.id}
                        className='border-b-primary bg-background max-h-100 rounded-none border-t-0 border-r-0 border-l-0 bg-none shadow-none'
                      >
                        <CardHeader
                          className={`p-0 ${isEven ? 'text-right' : 'text-left'}`}
                        >
                          <CardTitle className='font-interlope text-bgs-text text-4xl font-normal md:text-6xl'>
                            {addon.name}
                          </CardTitle>
                        </CardHeader>
                        <div
                          className={`flex items-stretch gap-6 ${isEven ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <div className='flex flex-1 flex-col justify-between gap-4'>
                            <CardDescription
                              className={`font-fraunces text-bgs-text max-w-md font-normal ${isEven ? 'ml-auto text-right' : ''}`}
                            >
                              {addon.description}
                            </CardDescription>
                            <div
                              className={isEven ? 'text-right' : 'text-left'}
                            >
                              <Button
                                size='lg'
                                onClick={() => toggleAddon(addon.id)}
                                disabled={isDisabled}
                                className='border-primary bg-bgs-pink font-fraunces border text-black'
                              >
                                {isSelected ? 'selected!' : 'i choose you'}
                              </Button>
                            </div>
                          </div>
                          <div className='relative aspect-square w-48 shrink-0 overflow-hidden rounded-lg md:w-64'>
                            <Image
                              src='/bgs-logo.png'
                              alt='placeholder'
                              fill
                              className='object-cover'
                              sizes='(max-width: 768px) 192px, 256px'
                            />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className='flex flex-col items-center gap-3 pt-2'>
                  {error && <p className='text-sm text-red-500'>{error}</p>}
                  <Button
                    onClick={handleCheckout}
                    disabled={
                      isLoading ||
                      selectedTier.addon_slots !== selectedAddonIds.length
                    }
                    size='lg'
                    className='border-primary bg-bgs-pink font-fraunces border text-black'
                  >
                    {isLoading
                      ? 'Redirecting...'
                      : `Subscribe — ${formatPrice(getPrice(selectedTier))}/${interval === 'month' ? 'mo' : 'yr'}`}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
