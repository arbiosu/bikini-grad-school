import { Result, success, failure } from '@/lib/common/result';
import {
  ValidationError,
  DatabaseError,
  RepositoryError,
} from '@/lib/common/errors';
import { TagHandler } from '@/domain/tags/handlers/tag-handler';
import { TagData } from '../domain/tags/types';
import { TagRepository } from '../repositories/tag-repository';
import type { Tables } from '@/lib/supabase/database/types';

export interface CreateTagParams {
  tag: TagData;
}

export interface UpdateTagParams {
  id: number;
  name?: string;
}

export class TagService {
  constructor(
    private repo: TagRepository,
    private handler: TagHandler
  ) {}

  async createTag(
    params: CreateTagParams
  ): Promise<
    Result<Tables<'tags'>, DatabaseError | ValidationError | RepositoryError>
  > {
    const validation = this.handler.validate(params.tag);
    if (!validation.isValid) {
      return failure(new ValidationError(validation.errors));
    }
    const cleanData = this.handler.transform(params.tag);

    const result = await this.repo.create(cleanData);
    return result;
  }

  async updateTag(
    params: UpdateTagParams
  ): Promise<
    Result<Tables<'tags'>, DatabaseError | ValidationError | RepositoryError>
  > {
    const existing = await this.repo.findById(params.id);
    if (!existing.success) {
      return existing;
    }

    const update: Tables<'tags'> = {
      ...existing.data,
      ...params,
    };

    const result = await this.repo.update(update);
    return result;
  }

  async deleteTag(
    id: number
  ): Promise<Result<Tables<'tags'>, RepositoryError>> {
    const result = await this.repo.delete(id);

    return result;
  }

  async getTagById(
    id: number
  ): Promise<Result<Tables<'tags'>, RepositoryError>> {
    const result = await this.repo.findById(id);

    return result;
  }

  async getAllTags(): Promise<Result<Tables<'tags'>[], RepositoryError>> {
    const result = await this.repo.query();

    if (!result.success) {
      return result;
    }

    return success(result.data.data);
  }
}
