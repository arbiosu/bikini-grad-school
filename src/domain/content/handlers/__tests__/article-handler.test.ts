import { describe, it, expect } from 'vitest';
import { ArticleHandler } from '../article-handler';
import type { ArticleData } from '@/lib/content/domain/types';

describe('ArticleHandler', () => {
  const handler = new ArticleHandler();

  describe('validate', () => {
    it('should validate valid article data', () => {
      const validData: ArticleData = {
        body: 'This is a valid article body with enough content to pass validation rules and requirements set by the business.',
        featured_image: 'https://example.com/image.jpg',
      };

      const result = handler.validate(validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty body', () => {
      const invalidData: ArticleData = {
        body: '',
      };

      const result = handler.validate(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Article body is required and cannot be empty'
      );
    });

    it('should reject body that is too short', () => {
      const invalidData: ArticleData = {
        body: 'Too short',
      };

      const result = handler.validate(invalidData);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('at least 50 characters'))
      ).toBe(true);
    });

    it('should reject body that is too long', () => {
      const invalidData: ArticleData = {
        body: 'a'.repeat(100001),
      };

      const result = handler.validate(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('must not exceed'))).toBe(
        true
      );
    });

    it('should reject invalid featured image URL', () => {
      const invalidData: ArticleData = {
        body: 'This is a valid article body with enough content to pass validation.',
        featured_image: 'not-a-valid-url',
      };

      const result = handler.validate(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Featured image must be a valid URL');
    });

    it('should accept null featured image', () => {
      const validData: ArticleData = {
        body: 'This is a valid article body with enough content to pass validation.',
        featured_image: null,
      };

      const result = handler.validate(validData);

      expect(result.isValid).toBe(true);
    });

    it('should detect unclosed code blocks', () => {
      const invalidData: ArticleData = {
        body: `
          This is valid content with enough characters for validation.
          \`\`\`javascript
          const x = 1;
          // Missing closing backticks
        `,
      };

      const result = handler.validate(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Unclosed code block'))).toBe(
        true
      );
    });

    it('should detect very long lines', () => {
      const longLine = 'a'.repeat(1500);
      const invalidData: ArticleData = {
        body: longLine,
      };

      const result = handler.validate(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('very long line'))).toBe(
        true
      );
    });
  });

  describe('transform', () => {
    it('should trim and normalize body', () => {
      const data: ArticleData = {
        body: '  \n\n\nSome content here\n\n\n\nMore content\n\n\n\n  ',
      };

      const result = handler.transform(data);

      expect(result.body).toBe('Some content here\n\nMore content');
    });

    it('should normalize line endings', () => {
      const data: ArticleData = {
        body: 'Line 1\r\nLine 2\r\nLine 3',
      };

      const result = handler.transform(data);

      expect(result.body).toBe('Line 1\nLine 2\nLine 3');
    });

    it('should normalize featured image URL', () => {
      const data: ArticleData = {
        body: 'Valid content here with sufficient length for validation',
        featured_image: 'example.com/image.jpg',
      };

      const result = handler.transform(data);

      expect(result.featured_image).toBe('https://example.com/image.jpg');
    });

    it('should handle null featured image', () => {
      const data: ArticleData = {
        body: 'Valid content',
        featured_image: undefined,
      };

      const result = handler.transform(data);

      expect(result.featured_image).toBeNull();
    });
  });

  describe('extractHeadings', () => {
    it('should extract markdown headings', () => {
      const body = `
# Main Title
Some content
## Subtitle
More content
### Section
      `;

      const headings = handler.extractHeadings(body);

      expect(headings).toHaveLength(3);
      expect(headings[0]).toEqual({ level: 1, text: 'Main Title' });
      expect(headings[1]).toEqual({ level: 2, text: 'Subtitle' });
      expect(headings[2]).toEqual({ level: 3, text: 'Section' });
    });

    it('should return empty array for content without headings', () => {
      const body = 'Just plain content with no headings';

      const headings = handler.extractHeadings(body);

      expect(headings).toHaveLength(0);
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time based on word count', () => {
      const words = Array(400).fill('word').join(' '); // 400 words
      const minutes = handler.calculateReadingTime(words);

      expect(minutes).toBe(2); // 400 words / 200 wpm = 2 minutes
    });

    it('should round up to nearest minute', () => {
      const words = Array(250).fill('word').join(' '); // 250 words
      const minutes = handler.calculateReadingTime(words);

      expect(minutes).toBe(2); // 250 / 200 = 1.25, rounds up to 2
    });
  });

  describe('extractExcerpt', () => {
    it('should extract first paragraph', () => {
      const body =
        'This is the first paragraph.\n\nThis is the second paragraph.';
      const excerpt = handler.extractExcerpt(body);

      expect(excerpt).toBe('This is the first paragraph.');
    });

    it('should remove markdown formatting', () => {
      const body = '**Bold text** and *italic text* and [link](url) and `code`';
      const excerpt = handler.extractExcerpt(body);

      expect(excerpt).not.toContain('**');
      expect(excerpt).not.toContain('*');
      expect(excerpt).not.toContain('[');
      expect(excerpt).not.toContain('`');
    });

    it('should truncate at word boundary', () => {
      const longText = Array(100).fill('word').join(' ');
      const excerpt = handler.extractExcerpt(longText, 50);

      expect(excerpt.length).toBeLessThanOrEqual(50 + 3); // +3 for ...
      expect(excerpt.endsWith('...')).toBe(true);
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      const body = 'This is a test sentence with seven words';
      const count = handler.countWords(body);

      expect(count).toBe(8);
    });

    it('should handle extra whitespace', () => {
      const body = '  This   has    extra    spaces  ';
      const count = handler.countWords(body);

      expect(count).toBe(4);
    });
  });

  describe('hasSubstantialContent', () => {
    it('should pass for article with substantial content', () => {
      const body = `
# Introduction
${Array(150).fill('word').join(' ')}

## Section 1
${Array(150).fill('word').join(' ')}

## Section 2
${Array(150).fill('word').join(' ')}
      `;

      const result = handler.hasSubstantialContent(body);

      expect(result.hasContent).toBe(true);
      expect(result.reasons).toHaveLength(0);
    });

    it('should fail for article with too few words', () => {
      const body = 'Short article';

      const result = handler.hasSubstantialContent(body);

      expect(result.hasContent).toBe(false);
      expect(result.reasons.some((r) => r.includes('words'))).toBe(true);
    });

    it('should warn about missing headings', () => {
      const body = Array(150).fill('word').join(' ');

      const result = handler.hasSubstantialContent(body);

      expect(result.hasContent).toBe(false);
      expect(result.reasons.some((r) => r.includes('headings'))).toBe(true);
    });
  });
});
