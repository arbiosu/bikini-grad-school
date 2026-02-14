import { BaseHandler } from '@/lib/common/base-handler';
import { FeatureData } from '../types';
import type { ValidationResult } from '@/lib/common/result';
/**
 * Handler for Feature content type
 *
 * Features are shorter-form content or highlights
 *
 * Business Rules:
 * - Description must be between 10 and 5000 characters
 * - Description should be concise and focused
 */
export class FeatureHandler extends BaseHandler<FeatureData> {
  readonly type = 'feature';

  // Constants for validation rules
  private readonly MIN_DESCRIPTION_LENGTH = 10;
  private readonly MAX_DESCRIPTION_LENGTH = 5000;
  private readonly OPTIMAL_DESCRIPTION_LENGTH = 500; // For recommendations

  /**
   * Validate feature data according to business rules
   * PURE FUNCTION
   */
  validate(data: FeatureData): ValidationResult {
    const errors: string[] = [];

    // Validate description
    const descError = this.validateRequired(
      data.description,
      'Feature description'
    );
    if (descError) {
      errors.push(descError);
    }
    const lengthError = this.validateLength(
      data.description,
      'Feature description',
      this.MIN_DESCRIPTION_LENGTH,
      this.MAX_DESCRIPTION_LENGTH
    );
    if (lengthError) {
      errors.push(lengthError);
    }

    return this.collectErrors(errors);
  }

  /**
   * Transform/normalize feature data
   */
  transform(data: FeatureData): FeatureData {
    return {
      ...data,
      description: this.normalizeDescription(data.description),
    };
  }

  /**
   * Normalize feature description
   * - Trim whitespace
   * - Normalize internal whitespace
   * - Remove excessive line breaks
   */
  private normalizeDescription(description: string): string {
    return description
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines
  }

  /**
   * Get character count information
   * Useful for UI feedback
   */
  getCharacterInfo(description: string): {
    current: number;
    min: number;
    max: number;
    optimal: number;
    isValid: boolean;
    isOptimal: boolean;
  } {
    const current = description.length;

    return {
      current,
      min: this.MIN_DESCRIPTION_LENGTH,
      max: this.MAX_DESCRIPTION_LENGTH,
      optimal: this.OPTIMAL_DESCRIPTION_LENGTH,
      isValid:
        current >= this.MIN_DESCRIPTION_LENGTH &&
        current <= this.MAX_DESCRIPTION_LENGTH,
      isOptimal: current <= this.OPTIMAL_DESCRIPTION_LENGTH,
    };
  }

  /**
   * Get length recommendation
   */
  getLengthRecommendation(description: string): {
    status: 'too_short' | 'optimal' | 'acceptable' | 'too_long';
    message: string;
  } {
    const length = description.length;

    if (length < this.MIN_DESCRIPTION_LENGTH) {
      return {
        status: 'too_short',
        message: `Add at least ${this.MIN_DESCRIPTION_LENGTH - length} more characters`,
      };
    }

    if (length > this.MAX_DESCRIPTION_LENGTH) {
      return {
        status: 'too_long',
        message: `Remove at least ${length - this.MAX_DESCRIPTION_LENGTH} characters`,
      };
    }

    if (length <= this.OPTIMAL_DESCRIPTION_LENGTH) {
      return {
        status: 'optimal',
        message: 'Description length is optimal',
      };
    }

    return {
      status: 'acceptable',
      message: `Consider shortening to ${this.OPTIMAL_DESCRIPTION_LENGTH} characters for better readability`,
    };
  }

  /**
   * Extract first sentence for preview
   */
  extractPreview(description: string, maxLength: number = 100): string {
    const normalized = this.normalizeWhitespace(description);

    // Try to get first sentence
    const firstSentence = normalized.match(/^[^.!?]+[.!?]/)?.[0];

    if (firstSentence && firstSentence.length <= maxLength) {
      return firstSentence;
    }

    // Otherwise truncate at word boundary
    if (normalized.length <= maxLength) {
      return normalized;
    }

    const truncated = normalized.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  }

  /**
   * Count sentences in description
   */
  countSentences(description: string): number {
    const sentences = description.match(/[^.!?]+[.!?]+/g);
    return sentences ? sentences.length : 0;
  }

  /**
   * Check if description is concise
   * Features should be brief and to the point
   */
  isConcise(description: string): {
    isConcise: boolean;
    wordCount: number;
    sentenceCount: number;
    suggestions: string[];
  } {
    const wordCount = description.trim().split(/\s+/).length;
    const sentenceCount = this.countSentences(description);
    const suggestions: string[] = [];

    // Ideal features are 50-150 words
    const isWordCountGood = wordCount >= 50 && wordCount <= 150;

    // Ideal features are 2-5 sentences
    const isSentenceCountGood = sentenceCount >= 2 && sentenceCount <= 5;

    if (wordCount < 50) {
      suggestions.push(
        'Consider expanding your description to provide more context'
      );
    } else if (wordCount > 150) {
      suggestions.push(
        'Consider condensing your description - features work best when concise'
      );
    }

    if (sentenceCount < 2) {
      suggestions.push(
        'Break your description into multiple sentences for better readability'
      );
    } else if (sentenceCount > 5) {
      suggestions.push(
        'Consider combining or removing sentences for better flow'
      );
    }

    // Check for overly long sentences
    const avgWordsPerSentence =
      sentenceCount > 0 ? wordCount / sentenceCount : 0;
    if (avgWordsPerSentence > 30) {
      suggestions.push(
        'Some sentences are quite long - consider breaking them up'
      );
    }

    return {
      isConcise: isWordCountGood && isSentenceCountGood,
      wordCount,
      sentenceCount,
      suggestions,
    };
  }

  /**
   * Validate quality for publishing
   * PURE FUNCTION
   */
  validateQuality(description: string): {
    isQuality: boolean;
    score: number; // 0-100
    issues: string[];
  } {
    const issues: string[] = [];
    let score = 100;

    // Check length
    const charInfo = this.getCharacterInfo(description);
    if (!charInfo.isValid) {
      issues.push('Description length is outside acceptable range');
      score -= 30;
    } else if (!charInfo.isOptimal) {
      issues.push('Description is longer than optimal');
      score -= 10;
    }

    // Check conciseness
    const conciseCheck = this.isConcise(description);
    if (!conciseCheck.isConcise) {
      issues.push(...conciseCheck.suggestions);
      score -= 15;
    }

    // Check for placeholder text
    const placeholderPatterns = [
      /lorem ipsum/i,
      /placeholder/i,
      /todo/i,
      /\[.*?\]/,
      /xxx/i,
    ];

    for (const pattern of placeholderPatterns) {
      if (pattern.test(description)) {
        issues.push('Contains placeholder text');
        score -= 25;
        break;
      }
    }

    // Check for minimum capitalization (title case for features is good)
    if (description[0] && description[0] !== description[0].toUpperCase()) {
      issues.push('Description should start with a capital letter');
      score -= 5;
    }

    return {
      isQuality: score >= 70,
      score: Math.max(0, score),
      issues,
    };
  }
}
