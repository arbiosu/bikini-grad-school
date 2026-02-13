import {
  createAddonAction,
  updateAddonAction,
} from '@/actions/subscriptions/tiers';
import { useEntityForm } from '../useEntityForm';
import type {
  AddonProduct,
  CreateAddonProductDTO,
  UpdateAddonProductDTO,
} from '@/domain/subscriptions/types';
import type { FormMode } from '@/lib/common/form-types';

interface AddonFormData {
  name: string;
  description: string;
}

const INITIAL_FORM_DATA: AddonFormData = {
  name: '',
  description: '',
};

interface UseAddonFormOptions {
  mode: FormMode;
  editData?: AddonProduct;
  onSuccess?: () => void;
}

export function useAddonForm(options: UseAddonFormOptions) {
  return useEntityForm<AddonFormData, AddonProduct, AddonProduct>({
    mode: options.mode,
    editData: options.editData,
    onSuccess: options.onSuccess,
    initialData: INITIAL_FORM_DATA,

    mapEditToForm: (editData) => ({
      name: editData.name,
      description: editData.description ?? '',
    }),

    createAction: (data) => createAddonAction(data),
    updateAction: (existing, data) => updateAddonAction(existing.id, data),
    messages: {
      createSuccess: 'Add On created successfully!',
      editSuccess: 'Add On updated successfully!',
      createError: 'Failed to create add on',
      editError: 'Failed to update add on',
    },
  });
}
