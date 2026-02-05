import { BaseRepository } from '@/lib/content/repositories';
import { Result, success } from '@/lib/common/result';
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
} from '@/lib/common/errors';
import {
  createIssue,
  queryIssues,
  updateIssue,
  deleteIssue,
  type IssueQueryOptions,
} from '@/lib/supabase/model/issues';
import type { Tables, TablesInsert } from '@/lib/supabase/database/types';

export interface IssueQueryResult {
  data: Tables<'issues'>[];
  count: number | null;
}

export class IssueRepository extends BaseRepository {
  /**
   * Create a new Issue
   */
  async create(
    data: TablesInsert<'issues'>
  ): Promise<Result<Tables<'issues'>, RepositoryError>> {
    const result = await createIssue(data);
    return this.handleSingleResult(result, 'create', 'Issue');
  }

  /**
   * Find issue by id
   */
  async findById(
    id: number
  ): Promise<Result<Tables<'issues'>, DatabaseError | NotFoundError>> {
    const result = await queryIssues({ filter: { id } });
    if (result.error) {
      return this.handleQueryResult(result, 'Issue') as Result<
        Tables<'issues'>,
        DatabaseError
      >;
    }

    const issue = result.data?.[0];
    if (!issue) {
      return this.notFound('Issue', id);
    }

    return success(issue);
  }

  async query(
    options?: IssueQueryOptions
  ): Promise<Result<IssueQueryResult, RepositoryError>> {
    const result = await queryIssues(options);
    return this.handleQueryResult(result, 'Issue');
  }

  async update(
    data: Tables<'issues'>
  ): Promise<Result<Tables<'issues'>, RepositoryError>> {
    const idResult = this.requireId(data.id, 'Issue');
    if (!idResult.success) {
      return idResult as Result<Tables<'issues'>, DatabaseError>;
    }

    const result = await updateIssue(data);
    return this.handleSingleResult(result, 'update', 'Issue');
  }

  async delete(id: number): Promise<Result<Tables<'issues'>, RepositoryError>> {
    const result = await deleteIssue(id);
    return this.handleSingleResult(result, 'delete', 'Issue');
  }

  async count(
    filter?: IssueQueryOptions['filter']
  ): Promise<Result<number, DatabaseError>> {
    const result = await this.query({
      onlyCount: true,
      count: 'exact',
      filter,
    });
    if (!result.success) {
      return result as Result<number, DatabaseError>;
    }

    return success(result.data.count ?? 0);
  }
}
