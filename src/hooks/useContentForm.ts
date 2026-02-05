import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  createContentAction,
  updateContentAction,
} from '@/app/actions/contents';
import {
  getHandler,
  type ContentType,
  type ArticleData,
  type FeatureData,
  type InterviewData,
} from '@/lib/content/domain/handlers';
import { isValidationActionError } from '@/lib/common/action-types';
import type { Tables } from '@/lib/supabase/database/types';

/**
 * Form mode: create new content or edit existing
 */
type FormMode = 'create' | 'edit';

/**
 * Form status state
 */
type FormStatus =
  | { type: 'idle' }
  | { type: 'validating' }
  | { type: 'submitting' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string; errors?: string[] };

/**
 * Content contributor for form
 */
export interface FormContributor {
  contributor_id: number;
  role_id: number;
}

/**
 * Complete form data structure
 */
export interface ContentFormData {
  // Base content
  title: string;
  slug: string;
  summary: string;
  issue_id: number;
  published_at: string;
  type: Exclude<ContentType, 'content'>;
  published: boolean;

  // Type-specific data
  article?: ArticleData;
  feature?: FeatureData;
  interview?: InterviewData;

  // Contributors
  contributors: FormContributor[];
}

/**
 * Initial data for edit mode
 */
interface EditData {
  content: Tables<'contents'>;
  article?: Tables<'articles'>;
  feature?: Tables<'features'>;
  interview?: Tables<'interviews'>;
  contributors?: FormContributor[];
}

/**
 * Hook options
 */
interface UseContentFormOptions {
  mode: FormMode;
  editData?: EditData;
  onSuccess?: (contentId: number) => void;
}

/**
 * Field validation errors for real-time feedback
 */
interface FieldErrors {
  [key: string]: string | undefined;
}

const INITIAL_FORM_DATA: ContentFormData = {
  title: '',
  slug: '',
  summary: '',
  issue_id: 0,
  published_at: new Date().toISOString().split('T')[0],
  type: 'article',
  published: false,
  contributors: [],
};

const MAX_STEPS = 4;

/**
 * Custom hook for managing content form state and operations
 * Handles validation, multi-step navigation, and submission
 */
export function useContentForm(options: UseContentFormOptions) {
  const { mode, editData, onSuccess } = options;
  const router = useRouter();

  // Initialize form data
  const [formData, setFormData] = useState<ContentFormData>(() => {
    if (mode === 'edit' && editData) {
      return {
        title: editData.content.title,
        slug: editData.content.slug,
        summary: editData.content.summary || '',
        issue_id: editData.content.issue_id,
        published_at: editData.content.published_at || '',
        type: editData.content.type,
        published: editData.content.published || false,
        article: editData.article
          ? {
              id: editData.article.id,
              body: editData.article.body,
              featured_image: editData.article.featured_image,
            }
          : undefined,
        feature: editData.feature
          ? {
              id: editData.feature.id,
              description: editData.feature.description || '',
            }
          : undefined,
        interview: editData.interview
          ? {
              id: editData.interview.id,
              interviewee_name: editData.interview.interviewee_name,
              interviewee_bio: editData.interview.interviewee_bio,
              transcript: editData.interview.transcript || '',
              profile_image: editData.interview.profile_image,
            }
          : undefined,
        contributors: editData.contributors || [],
      };
    }
    return INITIAL_FORM_DATA;
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  /**
   * Update a specific field in the form
   */
  const updateField = useCallback(
    <K extends keyof ContentFormData>(field: K, value: ContentFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Clear general errors
      if (status.type === 'error') {
        setStatus({ type: 'idle' });
      }
    },
    [fieldErrors, status.type]
  );

  /**
   * Update nested type-specific data
   */
  const updateTypeData = useCallback(
    (
      type: ContentType,
      data: Partial<ArticleData | FeatureData | InterviewData>
    ) => {
      setFormData((prev) => {
        const currentTypeData =
          prev[type as 'article' | 'feature' | 'interview'];

        return {
          ...prev,
          [type]: {
            ...currentTypeData,
            ...data,
          },
        };
      });

      if (status.type === 'error') {
        setStatus({ type: 'idle' });
      }
    },
    [status.type]
  );

  /**
   * Update contributors
   */
  const updateContributors = useCallback(
    (contributors: FormContributor[]) => {
      setFormData((prev) => ({ ...prev, contributors }));

      if (status.type === 'error') {
        setStatus({ type: 'idle' });
      }
    },
    [status.type]
  );

  /**
   * Auto-generate slug from title
   */
  const generateSlug = useCallback(() => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    updateField('slug', slug);
  }, [formData.title, updateField]);

  /**
   * Validate current step
   */
  const validateStep = useCallback(
    (step: number): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];

      switch (step) {
        case 1: // Basic info
          if (!formData.title.trim()) {
            errors.push('Title is required');
          }
          if (!formData.slug.trim()) {
            errors.push('Slug is required');
          }
          if (formData.issue_id === 0) {
            errors.push('Please select an issue');
          }
          if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            errors.push(
              'Slug can only contain lowercase letters, numbers, and hyphens'
            );
          }
          break;

        case 2: // Type-specific data
          const handler = getHandler(formData.type);
          const typeData =
            formData.type === 'article'
              ? formData.article
              : formData.type === 'feature'
                ? formData.feature
                : formData.interview;

          if (!typeData) {
            errors.push(`${formData.type} data is missing`);
          } else {
            const validation = handler.validate(typeData as any);
            if (!validation.isValid) {
              errors.push(...validation.errors);
            }
          }
          break;

        case 3: // Contributors
          if (formData.contributors.length === 0) {
            errors.push('At least one contributor is required');
          }

          const invalidContributors = formData.contributors.filter(
            (c) => c.contributor_id === 0 || c.role_id === 0
          );

          if (invalidContributors.length > 0) {
            errors.push('All contributors must have a role assigned');
          }
          break;

        case 4: // Review - validate everything
          const step1 = validateStep(1);
          const step2 = validateStep(2);
          const step3 = validateStep(3);
          errors.push(...step1.errors, ...step2.errors, ...step3.errors);
          break;
      }

      return { isValid: errors.length === 0, errors };
    },
    [formData]
  );

  /**
   * Check if can proceed to next step
   */
  const canProceed = useMemo(() => {
    const validation = validateStep(currentStep);
    return validation.isValid;
  }, [currentStep, validateStep]);

  /**
   * Go to next step with validation
   */
  const goNext = useCallback(() => {
    const validation = validateStep(currentStep);

    if (!validation.isValid) {
      setStatus({
        type: 'error',
        message: 'Please fix the errors before proceeding',
        errors: validation.errors,
      });
      return;
    }

    if (currentStep < MAX_STEPS) {
      setCurrentStep((prev) => prev + 1);
      setStatus({ type: 'idle' });
    }
  }, [currentStep, validateStep]);

  /**
   * Go to previous step
   */
  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setStatus({ type: 'idle' });
    }
  }, [currentStep]);

  /**
   * Submit form (create or update)
   */
  const submit = useCallback(async () => {
    // Final validation
    const validation = validateStep(4);
    if (!validation.isValid) {
      setStatus({
        type: 'error',
        message: 'Please fix all validation errors',
        errors: validation.errors,
      });
      return;
    }

    setStatus({ type: 'submitting' });

    try {
      if (mode === 'create') {
        // Get type-specific data
        const typeData =
          formData.type === 'article'
            ? formData.article!
            : formData.type === 'feature'
              ? formData.feature!
              : formData.interview!;

        // Create content
        const result = await createContentAction({
          content: {
            title: formData.title,
            slug: formData.slug,
            summary: formData.summary,
            issue_id: formData.issue_id,
            published_at: formData.published_at,
            published: false,
            type: formData.type,
          },
          typeData,
          contributors: formData.contributors,
        });

        if (!result.success) {
          if (isValidationActionError(result.error)) {
            setStatus({
              type: 'error',
              message: 'Validation failed - please fix the following errors: ',
              errors: result.error.errors,
            });
          } else {
            setStatus({
              type: 'error',
              message: result.error.message || 'Failed to create content',
            });
          }
          return;
        }

        setStatus({
          type: 'success',
          message: 'Content created successfully!',
        });

        // Callback or redirect
        if (onSuccess) {
          onSuccess(result.data);
        } else {
          setTimeout(() => {
            router.push(`/admin/content/${result.data}`);
          }, 1500);
        }
      } else {
        // Edit mode - update content
        if (!editData?.content.id) {
          setStatus({ type: 'error', message: 'No content ID for editing' });
          return;
        }

        const typeData =
          formData.type === 'article'
            ? formData.article
            : formData.type === 'feature'
              ? formData.feature
              : formData.interview;

        const result = await updateContentAction({
          contentId: editData.content.id,
          content: {
            id: editData.content.id,
            title: formData.title,
            slug: formData.slug,
            summary: formData.summary,
            issue_id: formData.issue_id,
            published_at: formData.published_at,
            published: formData.published,
          },
          typeData: typeData as any,
          contributors: formData.contributors,
        });

        if (!result.success) {
          if (isValidationActionError(result.error)) {
            setStatus({
              type: 'error',
              message: 'Validation failed - please fix the following errors: ',
              errors: result.error.errors,
            });
          } else {
            setStatus({
              type: 'error',
              message: result.error.message || 'Failed to update content',
            });
          }
          return;
        }

        setStatus({
          type: 'success',
          message: 'Content updated successfully!',
        });

        if (onSuccess) {
          onSuccess(editData.content.id);
        }
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    }
  }, [formData, mode, editData, onSuccess, router, validateStep]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setStatus({ type: 'idle' });
    setFieldErrors({});
  }, []);

  /**
   * Get step label
   */
  const getStepLabel = useCallback((step: number): string => {
    const labels = {
      1: 'Basic Information',
      2: 'Content Details',
      3: 'Contributors',
      4: 'Review & Submit',
    };
    return labels[step as keyof typeof labels] || '';
  }, []);

  return {
    // State
    formData,
    currentStep,
    status,
    fieldErrors,
    canProceed,

    // Actions
    updateField,
    updateTypeData,
    updateContributors,
    generateSlug,
    goNext,
    goBack,
    submit,
    resetForm,

    // Utilities
    getStepLabel,
    validateStep,

    // Constants
    maxSteps: MAX_STEPS,
    isLoading: status.type === 'submitting' || status.type === 'validating',
    isSuccess: status.type === 'success',
    isError: status.type === 'error',
  };
}
