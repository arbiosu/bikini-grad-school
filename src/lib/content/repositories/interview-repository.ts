// lib/content/repositories/interview-repository.ts

import { Result, success } from '@/lib/common/result';
import { BaseRepository } from '@/lib/common/base-repository';
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
} from '@/lib/common/errors';
import {
  createInterview,
  queryInterviews,
  updateInterview,
  deleteInterview,
} from '@/lib/supabase/model/interviews';
import type { Tables, TablesInsert } from '@/lib/supabase/database/types';

/**
 * Repository for Interview table operations
 * Handles CRUD operations for interview-specific data
 */
export class InterviewRepository extends BaseRepository {
  /**
   * Create a new interview
   * Note: The content record must already exist with this ID
   */
  async create(
    data: TablesInsert<'interviews'>
  ): Promise<Result<Tables<'interviews'>, RepositoryError>> {
    const result = await createInterview(data);
    return this.handleSingleResult(result, 'create', 'Interview');
  }

  /**
   * Find interview by content ID
   */
  async findById(
    id: number
  ): Promise<Result<Tables<'interviews'>, DatabaseError | NotFoundError>> {
    const result = await queryInterviews({ filter: { id } });

    if (result.error) {
      return this.handleQueryResult(result, 'Interview') as Result<
        Tables<'interviews'>,
        DatabaseError
      >;
    }

    const interview = result.data?.[0];
    if (!interview) {
      return this.notFound('Interview', id);
    }

    return success(interview);
  }

  /**
   * Query interviews with optional filters
   */
  async query(options?: {
    count?: 'exact' | 'planned' | 'estimated';
    onlyCount?: boolean;
  }): Promise<
    Result<
      { data: Tables<'interviews'>[]; count: number | null },
      RepositoryError
    >
  > {
    const result = await queryInterviews(options);
    return this.handleQueryResult(result, 'Interview');
  }

  /**
   * Update interview
   */
  async update(
    data: Tables<'interviews'>
  ): Promise<Result<Tables<'interviews'>, RepositoryError>> {
    const idResult = this.requireId(data.id, 'Interview');
    if (!idResult.success) {
      return idResult as Result<Tables<'interviews'>, DatabaseError>;
    }

    const result = await updateInterview(data);
    return this.handleSingleResult(result, 'update', 'Interview');
  }

  /**
   * Delete interview by ID
   */
  async delete(
    id: number
  ): Promise<Result<Tables<'interviews'>, RepositoryError>> {
    const result = await deleteInterview(id);
    return this.handleSingleResult(result, 'delete', 'Interview');
  }
}
