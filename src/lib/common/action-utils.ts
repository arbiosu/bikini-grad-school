import { isValidationError, isNotFoundError, isStorageError } from './errors';
import type { ActionError } from './action-types';

/**
 * Convert error class instances to serializable objects
 */
export function serializeError(error: unknown): ActionError {
  if (isValidationError(error)) {
    return {
      code: 'VALIDATION_ERROR',
      message: error.message,
      errors: error.errors,
    };
  }

  if (isNotFoundError(error)) {
    return {
      code: 'NOT_FOUND',
      message: error.message,
      entityType: error.entityType,
      identifier: error.identifier,
    };
  }

  if (isStorageError(error)) {
    return {
      code: 'STORAGE_ERROR',
      message: error.message,
    };
  }

  // Handle ConflictError, DatabaseError, etc. as needed

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  };
}
