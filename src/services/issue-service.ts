import { Result, success, failure } from '@/lib/common/result';
import {
  ValidationError,
  DatabaseError,
  RepositoryError,
} from '@/lib/common/errors';
import { IssueHandler } from '../domain/issues/handlers/issue-handler';
import type { IssueData } from '../domain/issues/types';
import { IssueRepository } from '../repositories/issue-repository';
import type { Tables } from '@/lib/supabase/database/types';

export interface CreateIssueParams {
  issue: IssueData;
}

export interface UpdateIssueParams {
  id: number;
  issue_number?: string;
  publication_date?: string;
  published?: boolean;
  title?: string;
}

export class IssueService {
  constructor(
    private repo: IssueRepository,
    private handler: IssueHandler
  ) {}

  async createIssue(
    params: CreateIssueParams
  ): Promise<
    Result<Tables<'issues'>, DatabaseError | ValidationError | RepositoryError>
  > {
    const validateIssue = this.handler.validate(params.issue);
    if (!validateIssue.isValid) {
      return failure(new ValidationError(validateIssue.errors));
    }
    const transformedIssue = this.handler.transform(params.issue);

    const result = await this.repo.create(transformedIssue);

    return result;
  }

  async updateIssue(
    params: UpdateIssueParams
  ): Promise<
    Result<Tables<'issues'>, DatabaseError | ValidationError | RepositoryError>
  > {
    // TODO: validate
    const exisiting = await this.repo.findById(params.id);
    if (!exisiting.success) {
      return exisiting;
    }

    const update: Tables<'issues'> = {
      ...exisiting.data,
      ...params,
      updated_at: new Date(Date.now()).toISOString(),
    };

    const updateResult = await this.repo.update(update);

    return updateResult;
  }

  async deleteIssue(
    id: number
  ): Promise<Result<Tables<'issues'>, RepositoryError>> {
    const result = await this.repo.delete(id);

    return result;
  }

  async getIssueById(
    id: number
  ): Promise<Result<Tables<'issues'>, RepositoryError>> {
    const result = await this.repo.findById(id);

    return result;
  }

  async getPublishedIssues(): Promise<
    Result<Tables<'issues'>[], RepositoryError>
  > {
    const result = await this.repo.query({
      filter: {
        published: true,
      },
    });

    if (!result.success) {
      return result;
    }

    return success(result.data.data);
  }

  async getAllIssues(): Promise<Result<Tables<'issues'>[], RepositoryError>> {
    const result = await this.repo.query();

    if (!result.success) {
      return result;
    }

    return success(result.data.data);
  }

  async getCount(): Promise<Result<number, RepositoryError>> {
    const result = await this.repo.count();

    if (!result.success) {
      return result;
    }

    return success(result.data);
  }
}
