import { revalidatePath } from 'next/cache';
import { Result, success, failure } from '@/lib/common/result';
import {
  ValidationError,
  DatabaseError,
  RepositoryError,
} from '@/lib/common/errors';
import { IssueHandler, type IssueData } from '@/lib/issues/domain/handlers';
import { IssueRepository } from '../repositories/issue-repository';
import type { Tables } from '@/lib/supabase/database/types';

interface CreateIssueParams {
  issue: IssueData;
}

interface UpdateIssueParams {
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

    if (!result.success) {
      return result;
    }

    revalidatePath('/', 'layout');

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

    if (!updateResult.success) {
      return updateResult;
    }

    revalidatePath('/', 'layout');

    return updateResult;
  }

  async deleteIssue(
    id: number
  ): Promise<Result<Tables<'issues'>, RepositoryError>> {
    const result = await this.repo.delete(id);

    if (!result.success) {
      return result;
    }
    revalidatePath('/', 'layout');
    return result;
  }

  async getIssueById(
    id: number
  ): Promise<Result<Tables<'issues'>, RepositoryError>> {
    const result = await this.repo.findById(id);

    if (!result.success) {
      return result;
    }

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
}
