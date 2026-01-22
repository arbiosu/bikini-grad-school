'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { createIssue, updateIssue } from '@/lib/supabase/model/issues';
import { Tables, TablesInsert } from '@/lib/supabase/database/types';

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const INITIAL_FORM_DATA: TablesInsert<'issues'> = {
  title: '',
  published: false,
  publication_date: new Date().toISOString().split('T')[0],
  issue_number: '',
  cover_image: '',
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export function IssueForm({
  issue,
  mode = 'create',
}: {
  issue?: Tables<'issues'>;
  mode?: 'create' | 'edit';
}) {
  const [formStatus, setFormStatus] = useState<FormStatus>(INITIAL_STATUS);
  const [formData, setFormData] = useState<TablesInsert<'issues'>>(() => {
    if (mode === 'edit' && issue) {
      return issue;
    }
    return INITIAL_FORM_DATA;
  });

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
  }, []);

  const validateForm = (form: TablesInsert<'issues'>): string | null => {
    if (!form.title.trim()) {
      return 'Title is required';
    }
    if (!form.issue_number?.trim()) {
      return 'Issue number is required';
    }
    return null;
  };

  const handleFieldChange = useCallback(
    (field: keyof Tables<'issues'>, value: string | boolean | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (formStatus.error || formStatus.success) {
        setFormStatus(INITIAL_STATUS);
      }
    },
    [formStatus.error, formStatus.success]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ isLoading: true, error: null, success: null });

    const validationError = validateForm(formData);
    if (validationError) {
      setFormStatus({
        isLoading: false,
        error: validationError,
        success: null,
      });
      return;
    }
    try {
      switch (mode) {
        case 'create':
          const newIssue = {
            title: formData.title.trim(),
            issue_number: formData.issue_number?.trim(),
            publication_date: formData.publication_date,
            published: formData.published,
            cover_image: formData.cover_image,
          };
          const { data, error } = await createIssue(newIssue);
          if (error || !data) {
            setFormStatus({ isLoading: false, error: error, success: null });
            return;
          }
          resetForm();
          setFormStatus({
            isLoading: false,
            error: null,
            success: `Issue number ${data.issue_number}: ${data.title} has been successfully created!`,
          });
          break;
        case 'edit':
          if (!issue?.id) {
            setFormStatus({
              isLoading: false,
              error: 'issue ID is missing, but required for editing.',
              success: null,
            });
            return;
          }
          const updatedIssue = {
            id: issue.id,
            title: formData.title,
            issue_number: formData.issue_number,
            publication_date: formData.publication_date,
            published: formData.published,
            cover_image: formData.cover_image,
          };
          const { data: updateData, error: updateError } =
            await updateIssue(updatedIssue);
          if (updateError || !updateData) {
            setFormStatus({
              isLoading: false,
              error: updateError,
              success: null,
            });
            return;
          }
          setFormStatus({
            isLoading: false,
            error: null,
            success: `Issue number ${updateData.issue_number}: ${updateData.title} has been successfully updated!`,
          });
          break;
      }
    } catch (e) {
      let errorMessage = `Could not ${mode} issue. Please try again or contact an admin.`;
      if (e instanceof Error) {
        errorMessage = `Failed to ${mode} issue: ${e.message}`;
      }
      setFormStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };

  const isSubmitDisabled =
    formStatus.isLoading || !formData.title || !formData.issue_number;

  return (
    <section id='form' className='mx-auto max-w-7xl px-4'>
      <div className='flex max-w-3xl flex-col pb-5'>
        <h6 className='font-bold'>
          {mode === 'create' ? 'New' : 'Edit'} Issue Form
        </h6>
        <p>Fields marked with * are required.</p>
        <p>
          If you need help, refer to the{' '}
          <Link href='#' className='text-blue-600 underline'>
            guide
          </Link>{' '}
          or contact an Admin.
        </p>
      </div>
      <div className='max-w-7xl'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='title'>Title* - Case Sensitive</Label>
            <Input
              id='title'
              type='text'
              name='title'
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              disabled={formStatus.isLoading}
              placeholder='(e.g., obsession, coquette)'
            />
          </div>
          <div>
            <Label htmlFor='issue_number'>Issue Number*</Label>
            <Input
              id='issue_number'
              type='text'
              name='issue_number'
              value={formData.issue_number ?? ''}
              onChange={(e) =>
                handleFieldChange('issue_number', e.target.value)
              }
              disabled={formStatus.isLoading}
              placeholder='(e.g., 0.01, 0.02, 0.021)'
            />
          </div>
          <div>
            <Label htmlFor='publication_date'>
              Publication Date* - {formData.publication_date}
            </Label>
            <Input
              id='publication_date'
              type='date'
              name='publication_date'
              value={formData.publication_date}
              onChange={(e) =>
                handleFieldChange('publication_date', e.target.value)
              }
            />
          </div>
          <div className='mt-4 min-h-[20px]'>
            {' '}
            {formStatus.error && (
              <p className='text-red-600' role='alert'>
                {formStatus.error}
              </p>
            )}
            {formStatus.success && (
              <p className='text-green-600' role='alert'>
                {formStatus.success}
              </p>
            )}
          </div>
          <Button
            type='submit'
            size='lg'
            disabled={isSubmitDisabled}
            className='bg-violet-800 text-white'
          >
            {formStatus.isLoading
              ? 'Processing...'
              : mode === 'create'
                ? 'Create Issue'
                : 'Update Issue'}
          </Button>
        </form>
      </div>
    </section>
  );
}
