import {
  createTierAction,
  updateTierAction,
} from '@/actions/subscriptions/tiers';
import { useEntityForm } from '../useEntityForm';
import type {
  CreateTierDTO,
  UpdateTierDTO,
  TierWithPrices,
} from '@/domain/subscriptions/types';
import type { FormMode } from '@/lib/common/form-types';

interface TierFormData {
  name: string;
  description: string;
  addon_slots: number;
  monthly_price: number; // in cents
  annual_price: number; // in cents
  currency: string;
  image_url: string;
}

const INITIAL_FORM_DATA: TierFormData = {
  name: '',
  description: '',
  addon_slots: 0,
  monthly_price: 0,
  annual_price: 0,
  currency: 'usd',
  image_url: '',
};

function mapEditToForm(tier: TierWithPrices): TierFormData {
  const monthlyPrice = tier.prices.find(
    (p) => p.interval === 'month' && p.is_active
  );
  const annualPrice = tier.prices.find(
    (p) => p.interval === 'year' && p.is_active
  );

  return {
    name: tier.name,
    description: tier.description ?? '',
    addon_slots: tier.addon_slots,
    monthly_price: monthlyPrice?.amount ?? 0,
    annual_price: annualPrice?.amount ?? 0,
    currency: monthlyPrice?.currency ?? 'usd',
    image_url: tier.image_url,
  };
}

function toCreateDTO(data: TierFormData): CreateTierDTO {
  return {
    name: data.name,
    description: data.description || undefined,
    addon_slots: data.addon_slots,
    prices: {
      monthly: data.monthly_price,
      annual: data.annual_price,
    },
    currency: data.currency,
    image_url: data.image_url,
  };
}

function toUpdateDTO(data: TierFormData): UpdateTierDTO {
  return {
    name: data.name,
    description: data.description || undefined,
    addon_slots: data.addon_slots,
    image_url: data.image_url,
  };
}

interface UseTierFormOptions {
  mode: FormMode;
  editData?: TierWithPrices;
  onSuccess?: () => void;
}

export function useTierForm(options: UseTierFormOptions) {
  return useEntityForm<TierFormData, TierWithPrices, TierWithPrices>({
    mode: options.mode,
    editData: options.editData,
    onSuccess: options.onSuccess,
    initialData: INITIAL_FORM_DATA,

    mapEditToForm,
    createAction: (data) => createTierAction(toCreateDTO(data)),
    updateAction: (existing, data) =>
      updateTierAction(existing.id, toUpdateDTO(data)),
    messages: {
      createSuccess: 'Tier created successfully!',
      editSuccess: 'Tier updated successfully!',
      createError: 'Failed to create tier',
      editError: 'Failed to update tier',
    },
  });
}
