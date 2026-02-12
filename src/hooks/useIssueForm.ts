import { createIssueAction, updateIssueAction } from '@/actions/issues';
import { useEntityForm } from './useEntityForm';
import type { IssueData } from '@/domain/issues/types';
import type { Tables } from '@/lib/supabase/database/types';
import type { FormMode } from '@/lib/common/form-types';

interface EditData {
  issue: Tables<'issues'>;
}

interface UseIssueFormOptions {
  mode: FormMode;
  editData?: EditData;
  onSuccess?: () => void;
}

const INITIAL_FORM_DATA: IssueData = {
  title: '',
  issue_number: '',
  publication_date: new Date().toISOString().split('T')[0],
  published: false,
  cover_image: '',
};

export function useIssueForm(options: UseIssueFormOptions) {
  return useEntityForm<IssueData, EditData, number>({
    mode: options.mode,
    editData: options.editData,
    onSuccess: options.onSuccess,
    initialData: INITIAL_FORM_DATA,

    mapEditToForm: (editData) => ({
      title: editData.issue.title,
      issue_number: editData.issue.issue_number ?? '',
      publication_date: editData.issue.publication_date,
      published: editData.issue.published,
      cover_image: editData.issue.cover_image ?? '',
    }),

    createAction: (data) => createIssueAction({ issue: data }),

    updateAction: (editData, data) =>
      updateIssueAction({ id: editData.issue.id, ...data }),

    messages: {
      createSuccess: 'Issue created successfully!',
      editSuccess: 'Issue edited successfully!',
      createError: 'Failed to create issue',
      editError: 'Failed to edit issue',
      noEditId: 'No issue ID for editing',
    },
  });
}
