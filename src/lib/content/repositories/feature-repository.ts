// lib/content/repositories/feature-repository.ts

import { Result, success } from '@/lib/common/result';
import { BaseRepository } from '@/lib/common/base-repository';
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
} from '@/lib/common/errors';
import {
  createFeature,
  queryFeatures,
  updateFeature,
  deleteFeature,
} from '@/lib/supabase/model/features';
import type { Tables, TablesInsert } from '@/lib/supabase/database/types';

/**
 * Repository for Feature table operations
 * Handles CRUD operations for feature-specific data
 */
export class FeatureRepository extends BaseRepository {
  /**
   * Create a new feature
   * Note: The content record must already exist with this ID
   */
  async create(
    data: TablesInsert<'features'>
  ): Promise<Result<Tables<'features'>, RepositoryError>> {
    const result = await createFeature(data);
    return this.handleSingleResult(result, 'create', 'Feature');
  }

  /**
   * Find feature by content ID
   */
  async findById(
    id: number
  ): Promise<Result<Tables<'features'>, DatabaseError | NotFoundError>> {
    const result = await queryFeatures({ filter: { id } });

    if (result.error) {
      return this.handleQueryResult(result, 'Feature') as Result<
        Tables<'features'>,
        DatabaseError
      >;
    }

    const feature = result.data?.[0];
    if (!feature) {
      return this.notFound('Feature', id);
    }

    return success(feature);
  }

  /**
   * Query features with optional filters
   */
  async query(options?: {
    count?: 'exact' | 'planned' | 'estimated';
    onlyCount?: boolean;
    limit?: number;
  }): Promise<
    Result<
      { data: Tables<'features'>[]; count: number | null },
      RepositoryError
    >
  > {
    const result = await queryFeatures(options);
    return this.handleQueryResult(result, 'Feature');
  }

  /**
   * Update feature
   */
  async update(
    data: Tables<'features'>
  ): Promise<Result<Tables<'features'>, RepositoryError>> {
    const idResult = this.requireId(data.id, 'Feature');
    if (!idResult.success) {
      return idResult as Result<Tables<'features'>, DatabaseError>;
    }

    const result = await updateFeature(data);
    return this.handleSingleResult(result, 'update', 'Feature');
  }

  /**
   * Delete feature by ID
   */
  async delete(
    id: number
  ): Promise<Result<Tables<'features'>, RepositoryError>> {
    const result = await deleteFeature(id);
    return this.handleSingleResult(result, 'delete', 'Feature');
  }
}
