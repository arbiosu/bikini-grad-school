import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  FormStatus,
  FormMode,
  FieldErrors,
} from '@/lib/common/form-types';
import type { ActionResult } from '@/lib/common/action-types';
import { isValidationActionError } from '@/lib/common/action-types';

interface UseEntityFormOptions<TFormData, TEditData> {
  mode: FormMode;
  initialData: TFormData;
  editData?: TEditData;

  /** Maps the edit entity into the form data shape */
  mapEditToForm: (editData: TEditData) => TFormData;
  createAction: (data: TFormData) => Promise<ActionResult<number>>;
  updateAction: (
    editData: TEditData,
    data: TFormData
  ) => Promise<ActionResult<number>>;

  /** Callback fired after a successful create or update (after delay) */
  onSuccess?: () => void;

  /** Customize the success/error messages */
  messages?: {
    createSuccess?: string;
    editSuccess?: string;
    createError?: string;
    editError?: string;
    noEditId?: string;
  };

  /** Delay in ms before calling onSuccess or resetForm (default: 1500) */
  successDelay?: number;
}

const DEFAULT_MESSAGES = {
  createSuccess: 'Created successfully!',
  editSuccess: 'Updated successfully!',
  createError: 'Failed to create',
  editError: 'Failed to update',
  noEditId: 'No ID provided for editing',
};

export function useEntityForm<TFormData extends object, TEditData>(
  options: UseEntityFormOptions<TFormData, TEditData>
) {
  const {
    mode,
    initialData,
    editData,
    mapEditToForm,
    createAction,
    updateAction,
    onSuccess,
    messages: customMessages,
    successDelay = 1500,
  } = options;

  const messages = { ...DEFAULT_MESSAGES, ...customMessages };

  const [formData, setFormData] = useState<TFormData>(() => {
    if (mode === 'edit' && editData) {
      return mapEditToForm(editData);
    }
    return initialData;
  });

  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updateField = useCallback(
    <K extends keyof TFormData>(field: K, value: TFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (fieldErrors[field as string]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      if (status.type === 'error') {
        setStatus({ type: 'idle' });
      }
    },
    [fieldErrors, status.type]
  );

  const handleSuccess = useCallback(
    (message: string) => {
      setStatus({ type: 'success', message });

      timeoutRef.current = setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          resetForm();
        }
      }, successDelay);
    },
    [onSuccess, successDelay]
  );

  const handleError = useCallback(
    (result: ActionResult<number>, fallbackMessage: string) => {
      if (!result.success && result.error) {
        if (isValidationActionError(result.error)) {
          setStatus({
            type: 'error',
            message: 'Validation failed - please fix the following errors: ',
            errors: result.error.errors,
          });
        } else {
          setStatus({
            type: 'error',
            message: result.error.message || fallbackMessage,
          });
        }
      }
    },
    []
  );

  const submit = useCallback(async () => {
    setStatus({ type: 'submitting' });

    try {
      if (mode === 'create') {
        const result = await createAction(formData);

        if (!result.success) {
          handleError(result, messages.createError);
          return;
        }

        handleSuccess(messages.createSuccess);
      } else {
        if (!editData) {
          setStatus({ type: 'error', message: messages.noEditId });
          return;
        }

        const result = await updateAction(editData, formData);

        if (!result.success) {
          handleError(result, messages.editError);
          return;
        }

        handleSuccess(messages.editSuccess);
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
  }, [
    formData,
    mode,
    editData,
    createAction,
    updateAction,
    handleSuccess,
    handleError,
    messages,
  ]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setStatus({ type: 'idle' });
    setFieldErrors({});
  }, [initialData]);

  return {
    formData,
    status,
    fieldErrors,

    updateField,
    submit,
    resetForm,

    isLoading: status.type === 'submitting' || status.type === 'validating',
    isSuccess: status.type === 'success',
    isError: status.type === 'error',
  };
}
