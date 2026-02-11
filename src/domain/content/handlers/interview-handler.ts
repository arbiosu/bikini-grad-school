import { BaseHandler } from '@/lib/common/base-handler';
import { InterviewData } from '../types';
import type { ValidationResult } from '@/lib/common/result';

/**
 * Handler for Interview content type
 * PURE - no database calls, no side effects, fully synchronous
 *
 * Manages Q&A format content with interviewee information
 *
 * Business Rules:
 * - Interviewee name is required (2-200 characters)
 * - Transcript is required (minimum 100 characters)
 * - Bio is optional (max 2000 characters)
 * - Profile image must be valid URL if provided
 */
export class InterviewHandler extends BaseHandler<InterviewData> {
  readonly type = 'interview';

  // Constants for validation rules
  private readonly MIN_NAME_LENGTH = 2;
  private readonly MAX_NAME_LENGTH = 200;
  private readonly MIN_TRANSCRIPT_LENGTH = 100;
  private readonly MAX_TRANSCRIPT_LENGTH = 500000; // ~500KB
  private readonly MAX_BIO_LENGTH = 2000;

  /**
   * Validate interview data according to business rules
   */
  validate(data: InterviewData): ValidationResult {
    const errors: string[] = [];

    const nameError = this.validateRequired(
      data.interviewee_name,
      'Interviewee name'
    );
    if (nameError) {
      errors.push(nameError);
    }
    const nameLengthError = this.validateLength(
      data.interviewee_name,
      'Interviewee name',
      this.MIN_NAME_LENGTH,
      this.MAX_NAME_LENGTH
    );
    if (nameLengthError) {
      errors.push(nameLengthError);
    }

    const transcriptError = this.validateRequired(
      data.transcript,
      'Interview transcript'
    );
    if (transcriptError) {
      errors.push(transcriptError);
    }
    const transcriptLengthError = this.validateLength(
      data.transcript,
      'Interview transcript',
      this.MIN_TRANSCRIPT_LENGTH,
      this.MAX_TRANSCRIPT_LENGTH
    );
    if (transcriptLengthError) {
      errors.push(transcriptLengthError);
    }

    if (data.interviewee_bio) {
      const bioLengthError = this.validateLength(
        data.interviewee_bio,
        'Interviewee bio',
        undefined,
        this.MAX_BIO_LENGTH
      );
      if (bioLengthError) {
        errors.push(bioLengthError);
      }
    }

    if (data.profile_image) {
      if (!this.isValidUrl(data.profile_image)) {
        errors.push('Profile image must be a valid URL');
      }
    }

    return this.collectErrors(errors);
  }

  /**
   * Transform/normalize interview data
   */
  transform(data: InterviewData): InterviewData {
    return {
      ...data,
      interviewee_name: this.normalizeWhitespace(data.interviewee_name),
      interviewee_bio: data.interviewee_bio
        ? this.normalizeWhitespace(data.interviewee_bio)
        : null,
      transcript: this.normalizeTranscript(data.transcript),
      profile_image: data.profile_image
        ? this.normalizeUrl(data.profile_image)
        : null,
    };
  }

  /**
   * Normalize transcript
   * - Trim whitespace
   * - Normalize line endings
   * - Remove excessive blank lines
   */
  private normalizeTranscript(transcript: string): string {
    return transcript
      .trim()
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');
  }

  /**
   * Validate transcript format
   * Checks for Q&A formatting patterns
   */
  validateTranscriptFormat(transcript: string): {
    hasQuestions: boolean;
    hasAnswers: boolean;
    questionCount: number;
    answerCount: number;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Common Q&A patterns
    const questionPatterns = [
      /^Q:/im,
      /^Question:/im,
      /^Interviewer:/im,
      /^\*\*Q:/im,
      /^\*\*Question:/im,
    ];

    const answerPatterns = [
      /^A:/im,
      /^Answer:/im,
      /^Interviewee:/im,
      /^\*\*A:/im,
      /^\*\*Answer:/im,
      new RegExp(`^\\*\\*${this.escapeRegex(transcript.split(':')[0])}:`), // Name-based
    ];

    const hasQuestions = questionPatterns.some((pattern) =>
      pattern.test(transcript)
    );
    const hasAnswers = answerPatterns.some((pattern) =>
      pattern.test(transcript)
    );

    // Count Q&A pairs
    const questionCount = this.countMatches(
      transcript,
      /^(Q:|Question:|Interviewer:)/gim
    );
    const answerCount = this.countMatches(
      transcript,
      /^(A:|Answer:|Interviewee:)/gim
    );

    if (!hasQuestions && !hasAnswers) {
      warnings.push(
        'Transcript does not appear to follow Q&A format. Consider using Q: and A: prefixes'
      );
    }

    if (hasQuestions && !hasAnswers) {
      warnings.push('Transcript has questions but no clear answers');
    }

    if (!hasQuestions && hasAnswers) {
      warnings.push('Transcript has answers but no clear questions');
    }

    if (questionCount > 0 && answerCount > 0 && questionCount !== answerCount) {
      warnings.push(
        `Question/Answer count mismatch: ${questionCount} questions, ${answerCount} answers`
      );
    }

    // Check for very long unbroken text
    const paragraphs = transcript.split('\n\n');
    const longParagraphs = paragraphs.filter((p) => p.length > 2000);
    if (longParagraphs.length > 0) {
      warnings.push(
        `${longParagraphs.length} very long paragraph(s) detected - consider breaking into smaller Q&A pairs`
      );
    }

    return {
      hasQuestions,
      hasAnswers,
      questionCount,
      answerCount,
      warnings,
    };
  }

  /**
   * Extract quotes from transcript
   * Useful for generating previews or highlights
   */
  extractQuotes(transcript: string, maxQuotes: number = 3): string[] {
    const quotes: string[] = [];

    // Pattern to match answer sections
    const answerPattern =
      /(?:A:|Answer:|Interviewee:)\s*([^\n]+(?:\n(?!Q:|Question:|Interviewer:)[^\n]+)*)/gi;
    const matches = Array.from(transcript.matchAll(answerPattern));

    for (const match of matches) {
      if (quotes.length >= maxQuotes) break;

      const answer = match[1].trim();

      // Get first sentence or up to 200 chars
      const firstSentence = answer.match(/^[^.!?]+[.!?]/)?.[0];
      if (firstSentence && firstSentence.length >= 20) {
        quotes.push(firstSentence.trim());
      } else if (answer.length >= 20) {
        const truncated = answer.substring(0, 200);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) {
          quotes.push(truncated.substring(0, lastSpace) + '...');
        }
      }
    }

    return quotes;
  }

  /**
   * Extract all questions from transcript
   */
  extractQuestions(transcript: string): string[] {
    const questions: string[] = [];
    const questionPattern =
      /(?:Q:|Question:|Interviewer:)\s*([^\n]+(?:\n(?!A:|Answer:|Interviewee:)[^\n]+)*)/gi;
    const matches = Array.from(transcript.matchAll(questionPattern));

    for (const match of matches) {
      const question = match[1].trim();
      if (question) {
        questions.push(question);
      }
    }

    return questions;
  }

  /**
   * Calculate interview statistics
   */
  getInterviewStats(transcript: string): {
    wordCount: number;
    estimatedMinutes: number;
    questionCount: number;
    averageAnswerLength: number;
  } {
    const wordCount = transcript.trim().split(/\s+/).length;
    const wordsPerMinute = 150; // Speaking rate
    const estimatedMinutes = Math.ceil(wordCount / wordsPerMinute);

    const formatCheck = this.validateTranscriptFormat(transcript);
    const questionCount = formatCheck.questionCount;

    // Calculate average answer length
    const quotes = this.extractQuotes(transcript, 100); // Get all quotes
    const avgAnswerLength =
      quotes.length > 0
        ? Math.round(
            quotes.reduce((sum, q) => sum + q.split(/\s+/).length, 0) /
              quotes.length
          )
        : 0;

    return {
      wordCount,
      estimatedMinutes,
      questionCount,
      averageAnswerLength: avgAnswerLength,
    };
  }

  /**
   * Generate interview preview/summary
   */
  generatePreview(data: InterviewData, maxLength: number = 200): string {
    const name = data.interviewee_name;
    const quotes = this.extractQuotes(data.transcript, 1);

    if (quotes.length > 0) {
      const quote = quotes[0];
      if (quote.length <= maxLength) {
        return `${name}: "${quote}"`;
      }
    }

    // Fallback to bio or generic message
    if (data.interviewee_bio) {
      const bioPreview = this.normalizeWhitespace(data.interviewee_bio);
      if (bioPreview.length <= maxLength) {
        return `Interview with ${name}: ${bioPreview}`;
      }
      return `Interview with ${name}: ${bioPreview.substring(0, maxLength - 20)}...`;
    }

    return `Interview with ${name}`;
  }

  /**
   * Validate quality for publishing
   */
  validateQuality(data: InterviewData): {
    isQuality: boolean;
    score: number; // 0-100
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check transcript format
    const formatCheck = this.validateTranscriptFormat(data.transcript);
    if (formatCheck.warnings.length > 0) {
      issues.push(...formatCheck.warnings);
      score -= 20;
    }

    // Check for sufficient content
    const stats = this.getInterviewStats(data.transcript);
    if (stats.questionCount < 3) {
      issues.push('Interview has fewer than 3 questions');
      score -= 15;
    }

    if (stats.wordCount < 500) {
      issues.push('Interview transcript is quite short (< 500 words)');
      score -= 10;
    }

    // Check if bio is provided
    if (!data.interviewee_bio) {
      recommendations.push('Consider adding an interviewee bio for context');
      score -= 5;
    }

    // Check if profile image is provided
    if (!data.profile_image) {
      recommendations.push('Consider adding a profile image');
      score -= 5;
    }

    return {
      isQuality: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations,
    };
  }

  /**
   * Helper: count regex matches in text
   */
  private countMatches(text: string, pattern: RegExp): number {
    const matches = text.match(pattern);
    return matches ? matches.length : 0;
  }

  /**
   * Helper: escape regex special characters
   */
  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
