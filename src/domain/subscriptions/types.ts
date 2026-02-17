export interface Subscription {
  id: string;
  stripe_subscription_id: string;
  user_id: string;
  tier_id: string;
  tier_price_id: string;
  status:
    | 'active'
    | 'past_due'
    | 'paused'
    | 'unpaid'
    | 'canceled'
    | 'trialing'
    | 'expired'
    | 'incomplete'
    | 'incomplete_expired';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionAddonSelection {
  id: string;
  subscription_id: string;
  addon_product_id: string;
  created_at: string;
}

export interface SubscriptionWithAddons extends Subscription {
  addon_selections: SubscriptionAddonSelection[];
}

export interface FullSubscription extends SubscriptionWithAddons {
  profiles: Profile;
}

export interface SubscriptionTier {
  id: string;
  stripe_product_id: string | null;
  name: string;
  description: string | null;
  addon_slots: number;
  is_active: boolean;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface TierPrice {
  id: string;
  tier_id: string;
  stripe_price_id: string | null;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddonProduct {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  stripe_customer_id: string | null;
  display_name: string | null;
  account_claimed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTierDTO {
  name: string;
  description?: string;
  addon_slots: number;
  prices: {
    monthly: number; // in cents
    annual: number; // in cents
  };
  currency?: string;
  image_url: string;
}

export interface UpdateTierDTO {
  name?: string;
  description?: string;
  addon_slots?: number;
  image_url?: string;
}

export interface CreateAddonProductDTO {
  name: string;
  description?: string;
  image_url: string;
}

export interface UpdateAddonProductDTO {
  name?: string;
  description?: string;
  image_url?: string;
}

export interface CreateCheckoutDTO {
  tierId: string;
  interval: 'month' | 'year';
  addonProductIds: string[];
  successUrl: string;
  cancelUrl: string;
}

export interface HandleCheckoutCompletedDTO {
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  customerEmail: string;
  shippingAddress: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postalCode: string;
    state: string;
  };
  name: string;
  promotionOptIn: boolean;
  metadata: {
    tier_id: string;
    tier_price_id: string;
    addon_product_ids: string;
  };
}

export interface ChangeTierDTO {
  userId: string;
  newTierId: string;
  newInterval: 'month' | 'year';
  addonProductIds: string[];
}

export interface SwapAddonsDTO {
  userId: string;
  addonProductIds: string[];
}

// --- Response Types (what the API returns) ---

export interface TierWithPrices extends SubscriptionTier {
  prices: TierPrice[];
}
