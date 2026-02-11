export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  website?: string;
  tiktok?: string;
}

export interface ContributorData {
  name: string;
  bio?: string;
  avatar?: string;
  social_links: SocialLinks;
}

// Type guard for runtime validation
export function isSocialLinks(value: unknown): value is SocialLinks {
  if (value === null || value === undefined) {
    return true; // Allow empty
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const allowedKeys = ['instagram', 'twitter', 'website', 'tiktok'];
  const obj = value as Record<string, unknown>;

  for (const key of Object.keys(obj)) {
    // Only allow known keys
    if (!allowedKeys.includes(key)) {
      return false;
    }
    // Values must be strings or undefined
    if (obj[key] !== undefined && typeof obj[key] !== 'string') {
      return false;
    }
  }

  return true;
}
