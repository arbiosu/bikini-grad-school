import { AddonProductRepository } from '@/repositories/subscriptions/addons';
import { Result, success, failure } from '@/lib/common/result';
import { ServiceError, ServiceRepositoryError } from '@/lib/common/errors';
import type {
  AddonProduct,
  CreateAddonProductDTO,
  UpdateAddonProductDTO,
} from '@/domain/subscriptions/types';

export class AddonProductService {
  constructor(private repo: AddonProductRepository) {}

  async list(activeOnly = true): Promise<Result<AddonProduct[], ServiceError>> {
    const result = await this.repo.findAll(activeOnly);
    if (!result.success) {
      return result;
    }

    return success(result.data.data);
  }

  async getById(id: string): Promise<Result<AddonProduct, ServiceError>> {
    return this.repo.findById(id);
  }

  async create(
    dto: CreateAddonProductDTO
  ): Promise<Result<AddonProduct, ServiceError>> {
    const result = await this.repo.create({
      name: dto.name,
      description: dto.description ?? null,
    });

    if (!result.success) {
      return result;
    }

    return success(result.data);
  }

  async update(
    id: string,
    dto: UpdateAddonProductDTO
  ): Promise<Result<AddonProduct, ServiceError>> {
    const existing = await this.repo.findById(id);
    if (!existing.success) {
      return failure(new ServiceRepositoryError('UpdateAddon', existing.error));
    }

    const updateResult = await this.repo.update(id, {
      ...(dto.name && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
    });

    if (!updateResult.success) {
      return failure(
        new ServiceRepositoryError('UpdateAddon', updateResult.error)
      );
    }

    const updated = await this.repo.findById(id);
    if (!updated.success) {
      return failure(new ServiceRepositoryError('UpdateAddon', updated.error));
    }

    return updated;
  }

  async deactivate(id: string): Promise<Result<null, ServiceError>> {
    const existing = await this.repo.findById(id);
    if (!existing.success) {
      return failure(new ServiceRepositoryError('UpdateAddon', existing.error));
    }

    const deactivated = await this.repo.deactivate(id);
    if (!deactivated.success) {
      return failure(
        new ServiceRepositoryError('DeactivateAddon', deactivated.error)
      );
    }

    return success(null);
  }
}
