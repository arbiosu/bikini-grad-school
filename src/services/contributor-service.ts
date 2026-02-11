import { Result, success, failure } from '@/lib/common/result';
import {
  ValidationError,
  DatabaseError,
  RepositoryError,
} from '@/lib/common/errors';
import { ContributorHandler } from '@/domain/contributors/handlers/contributor-handler';
import type { ContributorData } from '../domain/contributors/types';
import { ContributorRespository } from '../repositories/contributor-respository';
import type { Tables, Json } from '@/lib/supabase/database/types';

export interface CreateContributorParams {
  contributor: ContributorData;
}

export interface UpdateContributorParams {
  id: number;
  name?: string;
  bio?: string;
  avatar?: string;
}

export class ContributorService {
  constructor(
    private repo: ContributorRespository,
    private handler: ContributorHandler
  ) {}

  async createContributor(
    params: CreateContributorParams
  ): Promise<
    Result<
      Tables<'contributors'>,
      DatabaseError | ValidationError | RepositoryError
    >
  > {
    const validation = this.handler.validate(params.contributor);
    if (!validation.isValid) {
      return failure(new ValidationError(validation.errors));
    }
    const cleanData = this.handler.transform(params.contributor);

    const result = await this.repo.create({
      ...cleanData,
      social_links: cleanData.social_links as Json,
    });
    return result;
  }

  async updateContributor(
    params: UpdateContributorParams
  ): Promise<
    Result<
      Tables<'contributors'>,
      DatabaseError | ValidationError | RepositoryError
    >
  > {
    const existing = await this.repo.findById(params.id);
    if (!existing.success) {
      return existing;
    }

    const update: Tables<'contributors'> = {
      ...existing.data,
      ...params,
      updated_at: new Date(Date.now()).toISOString(),
    };

    const result = await this.repo.update(update);
    return result;
  }

  async deleteContributor(
    id: number
  ): Promise<Result<Tables<'contributors'>, RepositoryError>> {
    const result = await this.repo.delete(id);

    return result;
  }

  async getContributorById(
    id: number
  ): Promise<Result<Tables<'contributors'>, RepositoryError>> {
    const result = await this.repo.findById(id);

    return result;
  }

  async getAllContributors(): Promise<
    Result<Tables<'contributors'>[], RepositoryError>
  > {
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
