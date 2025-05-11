import { type Tables, TablesInsert } from '@/lib/supabase/database';

export type Count = 'exact' | 'planned' | 'estimated';
export type SortOrder = 'asc' | 'desc';

export type Article = Tables<'articles'>;
export type ArticleInsert = TablesInsert<'articles'>;

export type Issue = Tables<'issues'>;
export type IssueInsert = TablesInsert<'issues'>;

export type Contributor = Tables<'contributors'>;
export type ContributorInsert = TablesInsert<'contributors'>;

export type Photoshoot = Tables<'photoshoots'>;
export type PhotoshootInsert = TablesInsert<'photoshoots'>;

export type PhotoshootContributor = Tables<'photoshoot_contributors'>;

export type Role = Tables<'creative_roles'>;

export interface QueryArticlesOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: string;
    issueId?: number;
    published?: boolean;
  };
  select?: (keyof Article)[];
  sort?: {
    column?: keyof Article;
    order: SortOrder;
  };
  limit?: number;
}

export interface QueryArticlesResult {
  data: Article[] | null;
  error: string | null;
  count: number | null;
}

export interface ArticleResult {
  data: Article | null;
  error: string | null;
}

export interface QueryIssuesOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: number;
    published?: boolean;
  };
  select?: (keyof Issue)[];
  sort?: {
    column?: keyof Issue;
    order: SortOrder;
  };
  limit?: number;
}

export interface QueryIssuesResult {
  data: Issue[] | null;
  error: string | null;
  count: number | null;
}

export interface IssueResult {
  data: Issue | null;
  error: string | null;
}

export interface QueryContributorsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: string;
  };
  select?: (keyof Contributor)[];
  sort?: {
    column?: keyof Contributor;
    order?: SortOrder;
  };
  limit?: number;
}

export interface QueryContributorsResult {
  data: Contributor[] | null;
  error: string | null;
  count: number | null;
}

export interface ContributorResult {
  data: Contributor | null;
  error: string | null;
}

export interface QueryPhotoshootsOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    id?: string;
    issueId?: number;
  };
  select?: (keyof Photoshoot)[];
  sort?: {
    column?: keyof Photoshoot;
    order: SortOrder;
  };
  limit?: number;
}

export interface QueryPhotoshootsResult {
  data: Photoshoot[] | null;
  error: string | null;
  count: number | null;
}

export interface PhotoshootsResult {
  data: Photoshoot | null;
  error: string | null;
}

export interface PhotoshootContributorResult {
  data: PhotoshootContributor | null;
  error: string | null;
}

export interface FetchRolesResult {
  data: Role[] | null;
  error: string | null;
}

export type IssueContent =
  | { kind: 'article'; payload: Article }
  | { kind: 'photoshoot'; payload: Photoshoot };

export interface PhotoshootContributorExpanded {
  contributor: Contributor;
  photoshoot: Photoshoot;
  role: Role;
}

export interface PhotoshootContributorNames {
  role: { name: string | null };
  contributor: { name: string | null };
}

export interface PhotoshootContributorsNamesResult {
  data: PhotoshootContributorNames[];
  error: string | null;
}
