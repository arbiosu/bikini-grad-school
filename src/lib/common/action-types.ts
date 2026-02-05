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

export type ActionError =
  | SerializedValidationError
  | SerializedNotFoundError
  | SerializedConflictError
  | SerializedError;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

export function isValidationActionError(
  error: ActionError
): error is SerializedValidationError {
  return error.code === 'VALIDATION_ERROR';
}
