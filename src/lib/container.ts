import { ContentService } from '@/services/content-service';
import { IssueService } from '@/services/issue-service';
import { TagService } from '@/services/tag-service';
import { ContributorService } from '@/services/contributor-service';
import { RoleService } from '@/services/role-service';
import { StorageService } from '@/services/storage-service';
import { SubscriptionService } from '@/services/subscriptions/subscriptions';
import { TierService } from '@/services/subscriptions/tiers';
import { AddonProductService } from '@/services/subscriptions/addons';
import { EmailService } from '@/services/email-service';

import { RepositoryFactory } from '@/repositories/content';
import { TagRepository } from '@/repositories/tag-repository';
import { ContributorRespository } from '@/repositories/contributor-respository';
import { RoleRepository } from '@/repositories/role-repository';
import { IssueRepository } from '@/repositories/issue-repository';
import { SubscriptionRepository } from '@/repositories/subscriptions/subscriptions';
import { ProfileRepository } from '@/repositories/subscriptions/profiles';
import { TierRepository } from '@/repositories/subscriptions/tiers';
import { AddonProductRepository } from '@/repositories/subscriptions/addons';

import { TagHandler } from '@/domain/tags/handlers/tag-handler';
import { ContributorHandler } from '@/domain/contributors/handlers/contributor-handler';
import { CreativeRoleHandler } from '@/domain/roles/handlers/role-handler';
import { IssueHandler } from '@/domain/issues/handlers/issue-handler';

import type { SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';

/** Singleton instance of Stripe */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/** Singleton instance of Resend */
export const resend = new Resend(process.env.RESEND_SECRET_KEY!);

export function createContentService(supabase: SupabaseClient) {
  const repos = new RepositoryFactory(supabase);
  return new ContentService(repos);
}

export function createIssueService(supabase: SupabaseClient) {
  return new IssueService(new IssueRepository(supabase), new IssueHandler());
}

export function createTagService(supabase: SupabaseClient) {
  return new TagService(new TagRepository(supabase), new TagHandler());
}

export function createContributorService(supabase: SupabaseClient) {
  return new ContributorService(
    new ContributorRespository(supabase),
    new ContributorHandler()
  );
}

export function createRoleService(supabase: SupabaseClient) {
  return new RoleService(
    new RoleRepository(supabase),
    new CreativeRoleHandler()
  );
}

export function createStorageService() {
  return new StorageService();
}

export function createSubscriptionService(supabase: SupabaseClient) {
  const subRepo = new SubscriptionRepository(supabase);
  const tierRepo = new TierRepository(supabase);
  const profileRepo = new ProfileRepository(supabase);
  const emailService = new EmailService(
    resend,
    process.env.FROM_EMAIL_ADDRESS!
  );
  return new SubscriptionService(
    subRepo,
    profileRepo,
    tierRepo,
    stripe,
    supabase,
    emailService
  );
}

export function createTierService(supabase: SupabaseClient) {
  const repo = new TierRepository(supabase);
  return new TierService(repo, stripe);
}

export function createAddonProductService(supabase: SupabaseClient) {
  const repo = new AddonProductRepository(supabase);
  return new AddonProductService(repo);
}
