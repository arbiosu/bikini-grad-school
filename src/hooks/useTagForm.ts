import { createTagAction, updateTagAction } from '@/actions/tags';
import { useEntityForm } from './useEntityForm';
import type { TagData } from '@/domain/tags/types';
import type { Tables } from '@/lib/supabase/database/types';
import type { FormMode } from '@/lib/common/form-types';

interface EditData {
  tag: Tables<'creative_roles'>;
}

interface UseTagFormOptions {
  mode: FormMode;
  editData?: EditData;
  onSuccess?: () => void;
}

const INITIAL_FORM_DATA: TagData = {
  name: '',
};

export function useTagForm(options: UseTagFormOptions) {
  return useEntityForm<TagData, EditData>({
    mode: options.mode,
    editData: options.editData,
    onSuccess: options.onSuccess,
    initialData: INITIAL_FORM_DATA,

    mapEditToForm: (editData) => ({
      name: editData.tag.name,
    }),

    createAction: (data) => createTagAction({ tag: data }),

    updateAction: (editData, data) =>
      updateTagAction({ id: editData.tag.id, ...data }),

    messages: {
      createSuccess: 'Tag created successfully!',
      editSuccess: 'Tag edited successfully!',
      createError: 'Failed to create tag',
      editError: 'Failed to edit tag',
      noEditId: 'No tag ID for editing',
    },
  });
}
