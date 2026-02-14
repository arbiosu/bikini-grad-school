export interface SerializedError {
  code: string;
  message: string;
}

export interface SerializedValidationError extends SerializedError {
  code: 'VALIDATION_ERROR';
  errors: string[];
}

export interface SerializedNotFoundError extends SerializedError {
  code: 'NOT_FOUND';
  entityType: string;
  identifier: string | number;
}

export interface SerializedConflictError extends SerializedError {
  code: 'CONFLICT';
  conflictingField?: string;
}

export interface SerializedStorageError extends SerializedError {
  code: 'STORAGE_ERROR';
}

export interface SerializedExternalServiceError extends SerializedError {
  code: 'EXTERNAL_SERVICE_ERROR';
  service: string;
}

export interface SerializedPartialOperationError extends SerializedError {
  code: 'PARTIAL_OPERATION_ERROR';
  operation: string;
}

export interface SerializedBusinessRuleError extends SerializedError {
  code: 'BUSINESS_RULE_ERROR';
  rule: string;
}

export type ActionError =
  | SerializedValidationError
  | SerializedNotFoundError
  | SerializedConflictError
  | SerializedStorageError
  | SerializedExternalServiceError
  | SerializedPartialOperationError
  | SerializedBusinessRuleError
  | SerializedError;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

export function isValidationActionError(
  error: ActionError
): error is SerializedValidationError {
  return error.code === 'VALIDATION_ERROR';
}

export function isBusinessRuleActionError(
  error: ActionError
): error is SerializedBusinessRuleError {
  return error.code === 'BUSINESS_RULE_ERROR';
}

export function isExternalServiceActionError(
  error: ActionError
): error is SerializedExternalServiceError {
  return error.code === 'EXTERNAL_SERVICE_ERROR';
}
