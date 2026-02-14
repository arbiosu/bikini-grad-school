import { Result, success, failure } from '@/lib/common/result';
import {
  ValidationError,
  DatabaseError,
  RepositoryError,
} from '@/lib/common/errors';
import { CreativeRoleHandler } from '../domain/roles/handlers/role-handler';
import { CreativeRoleData } from '../domain/roles/types';
import { RoleRepository } from '../repositories/role-repository';
import type { Tables } from '@/lib/supabase/database/types';

export interface CreateRoleParams {
  role: CreativeRoleData;
}

export interface UpdateRoleParams {
  id: number;
  name?: string;
}

export class RoleService {
  constructor(
    private repo: RoleRepository,
    private handler: CreativeRoleHandler
  ) {}

  async createRole(
    params: CreateRoleParams
  ): Promise<
    Result<
      Tables<'creative_roles'>,
      DatabaseError | ValidationError | RepositoryError
    >
  > {
    const validation = this.handler.validate(params.role);
    if (!validation.isValid) {
      return failure(new ValidationError(validation.errors));
    }
    const cleanData = this.handler.transform(params.role);

    const result = await this.repo.create(cleanData);
    return result;
  }

  async updateRole(
    params: UpdateRoleParams
  ): Promise<
    Result<
      Tables<'creative_roles'>,
      DatabaseError | ValidationError | RepositoryError
    >
  > {
    const existing = await this.repo.findById(params.id);
    if (!existing.success) {
      return existing;
    }

    const update: Tables<'creative_roles'> = {
      ...existing.data,
      ...params,
    };

    const result = await this.repo.update(update);
    return result;
  }

  async deleteRole(
    id: number
  ): Promise<Result<Tables<'creative_roles'>, RepositoryError>> {
    const result = await this.repo.delete(id);

    return result;
  }

  async getRoleById(
    id: number
  ): Promise<Result<Tables<'creative_roles'>, RepositoryError>> {
    const result = await this.repo.findById(id);

    return result;
  }

  async getAllRoles(): Promise<
    Result<Tables<'creative_roles'>[], RepositoryError>
  > {
    const result = await this.repo.query();

    if (!result.success) {
      return result;
    }

    return success(result.data.data);
  }
}
