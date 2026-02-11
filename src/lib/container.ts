import { ContentService } from '@/services/content-service';
import { RepositoryFactory } from '@/repositories/content';
import { IssueService } from '@/services/issue-service';
import { TagService } from '@/services/tag-service';
import { ContributorService } from '@/services/contributor-service';
import { RoleService } from '@/services/role-service';
import { StorageService } from '@/services/storage-service';
import type { SupabaseClient } from '@supabase/supabase-js';
import { TagRepository } from '@/repositories/tag-repository';
import { TagHandler } from '@/domain/tags/handlers/tag-handler';
import { ContributorRespository } from '@/repositories/contributor-respository';
import { ContributorHandler } from '@/domain/contributors/handlers/contributor-handler';
import { RoleRepository } from '@/repositories/role-repository';
import { CreativeRoleHandler } from '@/domain/roles/handlers/role-handler';
import { IssueRepository } from '@/repositories/issue-repository';
import { IssueHandler } from '@/domain/issues/handlers/issue-handler';

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
