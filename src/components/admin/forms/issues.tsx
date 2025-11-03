'use client';

import { useState, useCallback } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { createIssue } from '@/lib/supabase/model/issues';

interface CreateIssueFormData {
  coverImage: string;
  issueNumber: string;
  publicationDate: string;
  title: string;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const INITIAL_FORM_DATA: CreateIssueFormData = {
  title: '',
  publicationDate: new Date().toLocaleDateString(),
  coverImage: '',
  issueNumber: '',
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export function CreateIssueForm() {
  const [formData, setFormData] =
    useState<CreateIssueFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isLoading: true, error: null, success: null });

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      setStatus({
        isLoading: false,
        error: 'Title is required',
        success: null,
      });
      return;
    }
    const trimmedIssueNumber = formData.issueNumber.trim();
    if (!trimmedIssueNumber) {
      setStatus({
        isLoading: false,
        error: 'Issue number is required',
        success: null,
      });
      return;
    }
    try {
      const issueData = {
        title: trimmedTitle,
        issue_number: trimmedIssueNumber,
        publication_date: formData.publicationDate,
      };
      const { data, error } = await createIssue(issueData);
      if (data) {
        resetForm();
        setStatus({
          isLoading: false,
          error: null,
          success: `Issue number ${trimmedIssueNumber}: ${trimmedTitle} has been successfully created!`,
        });
      } else {
        setStatus({ isLoading: false, error: error, success: null });
      }
    } catch (e) {
      let errorMessage =
        'Could not create issue. Please try again or contact an admin.';
      if (e instanceof Error) {
        errorMessage = `Failed to create issue: ${e.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };

  const isSubmitDisabled =
    status.isLoading || !formData.title.trim() || !formData.issueNumber.trim();

  return (
    <section id='form'>
      <div className='flex justify-center'>
        <h1 className='mb-4 text-xl'>New Issue Form</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='title'>Title* - cAsE SeNsItivE</Label>
            <Input
              id='title'
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              disabled={status.isLoading}
              required
              placeholder='(e.g., obsession, coquette)'
            />
          </div>
          <div>
            <Label htmlFor='issueNumber'>Issue Number*</Label>
            <Input
              id='issueNumber'
              type='text'
              name='issueNumber'
              value={formData.issueNumber}
              onChange={handleInputChange}
              disabled={status.isLoading}
              required
              placeholder='(e.g., 0.01, 0.02, 0.021)'
            />
          </div>
          <div>
            <Label htmlFor='publication_date'>
              Publication Date* - {formData.publicationDate}
            </Label>
            <Input
              id='publicationDate'
              type='date'
              name='publicationDate'
              value={formData.publicationDate}
              onChange={handleInputChange}
            />
          </div>
          <div className='mt-4 min-h-[20px]'>
            {' '}
            {status.error && <p className='text-red-600'>{status.error}</p>}
            {status.success && (
              <p className='text-green-600'>{status.success}</p>
            )}
          </div>
          <Button
            type='submit'
            variant={'outline'}
            size='lg'
            disabled={isSubmitDisabled}
          >
            {status.isLoading ? 'Processing...' : 'Submit Issue'}
          </Button>
        </form>
      </div>
    </section>
  );
}
