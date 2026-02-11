import {
  ValidationResult,
  validResult,
  invalidResult,
} from '@/lib/common/result';

/**
 * Abstract base class for content type handlers
 * Handlers are PURE - no side effects, no database calls, no async operations
 *
 * Responsibilities:
 * - Validate data according to business rules
 * - Transform/normalize data (trim, format, etc.)
 * - Provide domain-specific utilities
 *
 * @template T - The specific data type for this content (e.g., ArticleData)
 */
export abstract class BaseHandler<T> {
  /**
   * Content type identifier
   */
  abstract readonly type: string;

  /**
   * Validate data according to business rules
   * PURE FUNCTION - no side effects
   *
   * @param data - The data to validate
   * @returns ValidationResult with isValid flag and any error messages
   */
  abstract validate(data: T): ValidationResult;

  /**
   * Transform/normalize data
   * PURE FUNCTION - no side effects
   *
   * Examples:
   * - Trim whitespace
   * - Normalize URLs
   * - Format dates
   * - Sanitize HTML
   *
   * @param data - The data to transform
   * @returns Transformed data
   */
  abstract transform(data: T): T;

  /**
   * Protected helper: collect validation errors
   * Returns valid result if no errors, invalid result with errors otherwise
   */
  protected collectErrors(errors: string[]): ValidationResult {
    if (errors.length === 0) {
      return validResult();
    }
    return invalidResult(errors);
  }

  /**
   * Protected helper: validate URL format
   */
  protected isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Protected helper: validate string length
   */
  protected validateLength(
    value: string,
    fieldName: string,
    min?: number,
    max?: number
  ): string | null {
    const length = value.length;

    if (min !== undefined && length < min) {
      return `${fieldName} must be at least ${min} characters long`;
    }

    if (max !== undefined && length > max) {
      return `${fieldName} must not exceed ${max} characters`;
    }

    return null;
  }

  /**
   * Protected helper: validate required field
   */
  protected validateRequired(
    value: string | undefined | null,
    fieldName: string
  ): string | null {
    if (!value || value.trim().length === 0) {
      return `${fieldName} is required and cannot be empty`;
    }
    return null;
  }

  /**
   * Protected helper: normalize whitespace
   */
  protected normalizeWhitespace(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  /**
   * Protected helper: normalize URL (add protocol if missing, lowercase domain)
   */
  protected normalizeUrl(url: string): string {
    let normalized = url.trim();

    // Add https:// if no protocol
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    return normalized;
  }

  /**
   * Generate slug from a string
   */
  protected generateSlug(s: string): string {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  /**
   * Check if a slug is valid
   */
  protected isValidSlug(slug: string): boolean {
    const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return regex.test(slug);
  }
}

/**
 * Registry for handlers
 * Provides type-safe access to handlers
 */
export class HandlerRegistry {
  private handlers: Map<string, BaseHandler<any>> = new Map();

  /**
   * Register a handler
   */
  register<T>(handler: BaseHandler<T>): void {
    if (this.handlers.has(handler.type)) {
      throw new Error(
        `Handler for type '${handler.type}' is already registered`
      );
    }
    this.handlers.set(handler.type, handler);
  }

  /**
   * Get a handler by type
   * Returns undefined if not found
   */
  get<T>(type: string): BaseHandler<T> | undefined {
    return this.handlers.get(type);
  }

  /**
   * Check if a handler exists for a type
   */
  has(type: string): boolean {
    return this.handlers.has(type);
  }

  /**
   * Get a handler by type, throwing if not found
   */
  getOrThrow<T>(type: string): BaseHandler<T> {
    const handler = this.get<T>(type);
    if (!handler) {
      throw new Error(`No handler registered for content type: ${type}`);
    }
    return handler;
  }

  /**
   * Get all registered content types
   */
  getAllTypes(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Clear all registered handlers (useful for testing)
   */
  clear(): void {
    this.handlers.clear();
  }
}
