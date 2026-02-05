// lib/common/result.ts

/**
 * Result type for type-safe error handling
 * Represents either a successful result or a failure
 *
 * @template T - The type of the success value
 * @template E - The type of the error (defaults to Error)
 *
 * @example
 * const result: Result<User, ValidationError> = validateUser(data);
 * if (result.success) {
 *   console.log(result.data.name); // Type-safe access
 * } else {
 *   console.error(result.error.message);
 * }
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Helper to create a successful result
 */
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Helper to create a failed result
 */
export function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Check if a result is successful
 * Type guard for TypeScript type narrowing
 */
export function isSuccess<T, E>(
  result: Result<T, E>
): result is { success: true; data: T } {
  return result.success;
}

/**
 * Check if a result is a failure
 * Type guard for TypeScript type narrowing
 */
export function isFailure<T, E>(
  result: Result<T, E>
): result is { success: false; error: E } {
  return !result.success;
}

/**
 * Map the data of a successful result
 * If result is failure, returns the same failure
 *
 * @example
 * const result = success(5);
 * const doubled = mapResult(result, x => x * 2); // success(10)
 */
export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> {
  if (result.success) {
    return success(fn(result.data));
  }
  return result;
}

/**
 * Chain results together (flatMap)
 * Useful for sequences of operations that can fail
 *
 * @example
 * const result = success(5);
 * const chained = chainResult(result, x =>
 *   x > 0 ? success(x * 2) : failure(new Error('Must be positive'))
 * );
 */
export function chainResult<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> {
  if (result.success) {
    return fn(result.data);
  }
  return result;
}

/**
 * Unwrap a result, throwing if it's a failure
 * Use sparingly - prefer pattern matching with if/else
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.success) {
    return result.data;
  }
  throw result.error;
}

/**
 * Unwrap a result with a default value if it's a failure
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (result.success) {
    return result.data;
  }
  return defaultValue;
}

/**
 * Combine multiple results into a single result
 * If any result is a failure, returns the first failure
 * Otherwise returns success with an array of all data
 *
 * @example
 * const results = [success(1), success(2), success(3)];
 * const combined = combineResults(results); // success([1, 2, 3])
 */
export function combineResults<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const data: T[] = [];

  for (const result of results) {
    if (!result.success) {
      return result;
    }
    data.push(result.data);
  }

  return success(data);
}
