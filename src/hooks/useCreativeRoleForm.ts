import { createRoleAction, updateRoleAction } from '@/actions/roles';
import { useEntityForm } from './useEntityForm';
import type { CreativeRoleData } from '@/domain/roles/types';
import type { Tables } from '@/lib/supabase/database/types';
import type { FormMode } from '@/lib/common/form-types';

interface EditData {
  creativeRole: Tables<'creative_roles'>;
}

interface UseCreativeRoleFormOptions {
  mode: FormMode;
  editData?: EditData;
  onSuccess?: () => void;
}

const INITIAL_FORM_DATA: CreativeRoleData = {
  name: '',
};

export function useCreativeRoleForm(options: UseCreativeRoleFormOptions) {
  return useEntityForm<CreativeRoleData, EditData, number>({
    mode: options.mode,
    editData: options.editData,
    onSuccess: options.onSuccess,
    initialData: INITIAL_FORM_DATA,

    mapEditToForm: (editData) => ({
      name: editData.creativeRole.name,
    }),

    createAction: (data) => createRoleAction({ role: data }),

    updateAction: (editData, data) =>
      updateRoleAction({ id: editData.creativeRole.id, ...data }),

    messages: {
      createSuccess: 'Role created successfully!',
      editSuccess: 'Role edited successfully!',
      createError: 'Failed to create role',
      editError: 'Failed to edit role',
      noEditId: 'No role ID for editing',
    },
  });
}
