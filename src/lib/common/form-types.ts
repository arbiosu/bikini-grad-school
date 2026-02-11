/**
 * Form status state
 */
export type FormStatus =
  | { type: 'idle' }
  | { type: 'validating' }
  | { type: 'submitting' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string; errors?: string[] };

/**
 * Form mode: create new content or edit existing
 */
export type FormMode = 'create' | 'edit';

/**
 * Content contributor for form
 */
export interface FormContributor {
  contributor_id: number;
  role_id: number;
}

export interface FieldErrors {
  [key: string]: string | undefined;
}
