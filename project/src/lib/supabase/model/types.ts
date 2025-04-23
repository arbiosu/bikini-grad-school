import { type Tables, TablesInsert } from '../database';

export type Count = 'exact' | 'planned' | 'estimated';
export type SortOrder = 'asc' | 'desc';

export type Article = Tables<'articles'>;
export type ArticleInsert = TablesInsert<'articles'>;

export type Issue = Tables<'issues'>;
export type IssueInsert = TablesInsert<'issues'>;

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
