import { Result, success, failure } from '@/lib/common/result';
import {
  DatabaseError,
  NotFoundError,
  ConflictError,
  RepositoryError,
} from '@/lib/common/errors';
import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Base repository class providing common error handling patterns
 * All repositories should extend this class
 */
export abstract class BaseRepository {
  /**
   * Map Supabase PostgrestError to our domain RepositoryError
   */
  protected mapSupabaseError(
    error: PostgrestError,
    operation: 'create' | 'read' | 'update' | 'delete',
    entityType?: string
  ): RepositoryError {
    // Unique constraint violation
    if (error.code === '23505') {
      const field = this.extractConflictField(error.message);
      return new ConflictError(
        `${entityType || 'Record'} already exists with this ${field || 'value'}`,
        field
      );
    }

    // Foreign key violation
    if (error.code === '23503') {
      return new DatabaseError(
        `Referenced record does not exist. ${error.message}`,
        operation,
        error
      );
    }

    // Not null violation
    if (error.code === '23502') {
      return new DatabaseError(
        `Required field is missing. ${error.message}`,
        operation,
        error
      );
    }

    // Check constraint violation
    if (error.code === '23514') {
      return new DatabaseError(
        `Data validation failed. ${error.message}`,
        operation,
        error
      );
    }

    // Generic database error
    return new DatabaseError(
      error.message || `Database ${operation} operation failed`,
      operation,
      error
    );
  }

  /**
   * Extract conflicting field name from error message
   * Supabase error messages often contain: Key (field_name)=(value) already exists
   */
  private extractConflictField(message: string): string | undefined {
    const match = message.match(/Key \(([^)]+)\)/);
    return match?.[1];
  }

  /**
   * Handle "not found" case
   * When a query returns null/undefined but we expected data
   */
  protected notFound<T>(
    entityType: string,
    identifier: number | string
  ): Result<T, NotFoundError> {
    return failure(new NotFoundError(entityType, identifier));
  }

  /**
   * Wrap a Supabase operation that returns a single record
   * Handles both PostgrestError and null data cases
   */
  protected handleSingleResult<T>(
    result: { data: T | null; error: PostgrestError | null },
    operation: 'create' | 'read' | 'update' | 'delete',
    entityType: string
  ): Result<T, RepositoryError> {
    if (result.error) {
      return failure(
        this.mapSupabaseError(result.error, operation, entityType)
      );
    }

    if (!result.data) {
      return failure(
        new DatabaseError(
          `${operation} operation returned no data for ${entityType}`,
          operation
        )
      );
    }

    return success(result.data);
  }

  /**
   * Wrap a Supabase query operation that returns an array
   * Handles PostgrestError and normalizes null data to empty array
   */
  protected handleQueryResult<T>(
    result: {
      data: T[] | null;
      error: PostgrestError | null;
      count?: number | null;
    },
    entityType: string
  ): Result<{ data: T[]; count: number | null }, RepositoryError> {
    if (result.error) {
      return failure(this.mapSupabaseError(result.error, 'read', entityType));
    }

    // For queries, null data is acceptable (empty result set)
    const data = result.data || [];
    const count = result.count ?? null;

    return success({ data, count });
  }

  /**
   * Helper to validate required ID
   */
  protected requireId(
    id: number | undefined,
    entityType: string
  ): Result<number, DatabaseError> {
    if (!id) {
      return failure(
        new DatabaseError(
          `${entityType} ID is required for this operation`,
          'update'
        )
      );
    }
    return success(id);
  }
}
