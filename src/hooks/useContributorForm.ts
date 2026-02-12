import {
  createContributorAction,
  updateContributorAction,
} from '@/actions/contributors';
import { useEntityForm } from './useEntityForm';
import type { ContributorData, SocialLinks } from '@/domain/contributors/types';
import type { Tables } from '@/lib/supabase/database/types';
import type { FormMode } from '@/lib/common/form-types';

interface EditData {
  contributor: Tables<'contributors'>;
}

interface UseContributorFormOptions {
  mode: FormMode;
  editData?: EditData;
  onSuccess?: () => void;
}

const INITIAL_FORM_DATA: ContributorData = {
  name: '',
  bio: '',
  avatar: '',
  social_links: {},
};

export function useContributorForm(options: UseContributorFormOptions) {
  return useEntityForm<ContributorData, EditData, number>({
    mode: options.mode,
    editData: options.editData,
    onSuccess: options.onSuccess,
    initialData: INITIAL_FORM_DATA,

    mapEditToForm: (editData) => ({
      name: editData.contributor.name,
      bio: editData.contributor.bio ?? '',
      avatar: editData.contributor.avatar ?? '',
      social_links: (editData.contributor.social_links as SocialLinks) ?? {},
    }),

    createAction: (data) => createContributorAction({ contributor: data }),

    updateAction: (editData, data) =>
      updateContributorAction({ id: editData.contributor.id, ...data }),
    messages: {
      createSuccess: 'Contributor created successfully!',
      editSuccess: 'Contributor edited successfully!',
      createError: 'Failed to create contributor',
      editError: 'Failed to edit contributor',
      noEditId: 'No contributor ID for editing',
    },
  });
}
