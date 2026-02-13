/**
 * Base class for all domain errors
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation errors - when data doesn't meet business rules
 */
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  readonly errors: string[];

  constructor(errors: string[]) {
    super(ValidationError.formatMessage(errors));
    this.errors = errors;
  }

  private static formatMessage(errors: string[]): string {
    if (errors.length === 1) {
      return errors[0];
    }
    return `Validation failed with ${errors.length} error(s): ${errors.join('; ')}`;
  }

  /**
   * Check if validation failed for a specific field pattern
   */
  hasErrorForField(fieldPattern: string): boolean {
    return this.errors.some((error) =>
      error.toLowerCase().includes(fieldPattern.toLowerCase())
    );
  }
}

/**
 * Transformation errors - when data can't be transformed/normalized
 */
export class TransformationError extends DomainError {
  readonly code = 'TRANSFORMATION_ERROR';
  readonly field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}

/**
 * Business rule violation errors
 */
export class BusinessRuleError extends DomainError {
  readonly code = 'BUSINESS_RULE_ERROR';
  readonly rule: string;

  constructor(rule: string, message: string) {
    super(message);
    this.rule = rule;
  }
}

/**
 * Base class for all repository errors
 */
export abstract class RepositoryError extends Error {
  abstract readonly code: string;

  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Entity not found in database
 */
export class NotFoundError extends RepositoryError {
  readonly code = 'NOT_FOUND';

  constructor(
    public readonly entityType: string,
    public readonly identifier: number | string
  ) {
    super(`${entityType} with identifier '${identifier}' not found`);
  }
}

/**
 * Conflict error - duplicate key, unique constraint violation, etc.
 */
export class ConflictError extends RepositoryError {
  readonly code = 'CONFLICT';

  constructor(
    message: string,
    public readonly conflictingField?: string
  ) {
    super(message);
  }
}

/**
 * Generic database operation error
 */
export class DatabaseError extends RepositoryError {
  readonly code = 'DATABASE_ERROR';

  constructor(
    message: string,
    public readonly operation: 'create' | 'read' | 'update' | 'delete',
    cause?: unknown
  ) {
    super(message, cause);
  }
}

/**
 * Transaction-related errors
 */
export class TransactionError extends RepositoryError {
  readonly code = 'TRANSACTION_ERROR';

  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}

export class StorageError extends RepositoryError {
  readonly code = 'STORAGE_ERROR';

  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}

export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

/**
 * Type guard to check if error is a domain error
 */
export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}

/**
 * Type guard to check if error is a repository error
 */
export function isRepositoryError(error: unknown): error is RepositoryError {
  return error instanceof RepositoryError;
}

/**
 * Type guard to check if error is a validation error
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard to check if error is a not found error
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

/**
 * Helper to convert unknown error to a known error type
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('An unknown error occurred');
}

// Add these to your existing errors file

/**
 * Base class for service-level errors
 * Services orchestrate between external APIs, repositories, and domain logic
 */
export abstract class ServiceError extends Error {
  abstract readonly code: string;

  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * External API errors (Stripe, etc.)
 */
export class ExternalServiceError extends ServiceError {
  readonly code = 'EXTERNAL_SERVICE_ERROR';

  constructor(
    public readonly service: string,
    message: string,
    cause?: unknown
  ) {
    super(`${service}: ${message}`, cause);
  }
}

/**
 * When a service operation fails due to an underlying repository error
 * Wraps the original RepositoryError with service-level context
 */
export class ServiceRepositoryError extends ServiceError {
  readonly code = 'SERVICE_REPOSITORY_ERROR';

  constructor(
    public readonly operation: string,
    public readonly repositoryError: RepositoryError
  ) {
    super(`${operation} failed: ${repositoryError.message}`, repositoryError);
  }
}

/**
 * When a multi-step service operation partially completes
 * e.g., Stripe product created but DB insert failed
 */
export class PartialOperationError extends ServiceError {
  readonly code = 'PARTIAL_OPERATION_ERROR';

  constructor(
    public readonly operation: string,
    public readonly completedSteps: string[],
    public readonly failedStep: string,
    cause?: unknown
  ) {
    super(
      `${operation} partially completed. Completed: [${completedSteps.join(', ')}]. Failed at: ${failedStep}`,
      cause
    );
  }
}

export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof ServiceError;
}

export function isExternalServiceError(
  error: unknown
): error is ExternalServiceError {
  return error instanceof ExternalServiceError;
}

export function isPartialOperationError(
  error: unknown
): error is PartialOperationError {
  return error instanceof PartialOperationError;
}
