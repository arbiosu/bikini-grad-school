import {
  isValidationError,
  isNotFoundError,
  isStorageError,
  isExternalServiceError,
  isPartialOperationError,
} from './errors';
import { BusinessRuleError } from './errors';
import type { ActionError } from './action-types';

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

  if (error instanceof BusinessRuleError) {
    return {
      code: 'BUSINESS_RULE_ERROR',
      message: error.message,
      rule: error.rule,
    };
  }

  if (isExternalServiceError(error)) {
    return {
      code: 'EXTERNAL_SERVICE_ERROR',
      message: error.message,
      service: error.service,
    };
  }

  if (isPartialOperationError(error)) {
    return {
      code: 'PARTIAL_OPERATION_ERROR',
      message: error.message,
      operation: error.operation,
    };
  }

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
