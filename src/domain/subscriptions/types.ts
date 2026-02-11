export interface SubscriptionTier {
  id: string;
  stripe_product_id: string | null;
  name: string;
  description: string | null;
  addon_slots: number;
  is_active: boolean;
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
  created_at: string;
  updated_at: string;
}

// --- DTOs (what the API receives) ---

export interface CreateTierDTO {
  name: string;
  description?: string;
  addon_slots: number;
  prices: {
    monthly: number; // in cents
    annual: number; // in cents
  };
  currency?: string;
}

export interface UpdateTierDTO {
  name?: string;
  description?: string;
  addon_slots?: number;
}

export interface CreateAddonProductDTO {
  name: string;
  description?: string;
}

export interface UpdateAddonProductDTO {
  name?: string;
  description?: string;
}

// --- Response Types (what the API returns) ---

export interface TierWithPrices extends SubscriptionTier {
  prices: TierPrice[];
}
