'use client';

import { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { editIssue } from '@/lib/supabase/model/issues';
import { type Tables } from '@/lib/supabase/database';

interface EditIssueFormData {
  title: string;
  description: string;
  isPublished: boolean;
  publicationDate: string | null;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const PUBLISH_STATUS = {
  PUBLISHED: 'true',
  DRAFT: 'false',
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

interface IssueProps {
  issue: Tables<'issues'>;
}

export default function EditIssueForm({ issue }: IssueProps) {
  const [formData, setFormData] = useState<EditIssueFormData>({
    title: issue.title,
    description: issue.description,
    isPublished: issue.is_published,
    publicationDate: issue.publication_date,
  });
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

  const handlePublishedChange = useCallback(
    (value: string) => {
      setFormData((prevData) => ({
        ...prevData,
        isPublished: value === PUBLISH_STATUS.PUBLISHED,
      }));
      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

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

    try {
      const editedIssue = await editIssue({
        title: formData.title,
        description: formData.description,
        is_published: formData.isPublished,
        publication_date: formData.publicationDate,
        id: issue.id,
      });
      if (editedIssue.data) {
        setStatus({
          isLoading: false,
          error: null,
          success: 'Issue updated successfully!',
        });
      } else {
        setStatus({
          isLoading: false,
          error: editedIssue.error,
          success: null,
        });
      }
    } catch (error) {
      console.error(error);
      let errorMessage = 'Could not edit issue. Contact an admin.';
      if (error instanceof Error) {
        errorMessage = `Failed to edit issue: ${error.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };
  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h2 className='mb-6 text-2xl font-semibold'>Edit Article</h2>
      <div className='flex flex-col gap-24 md:flex-row'>
        <div className='flex-1'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='title' className='text-xl'>
                Title*
              </Label>
              <Input
                id='title'
                type='text'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                disabled={status.isLoading}
                required
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='description' className='text-xl'>
                Description
              </Label>
              <Input
                id='description'
                type='text'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                disabled={status.isLoading}
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='is_published' className='text-xl'>
                Status*
              </Label>
              <Select
                onValueChange={handlePublishedChange}
                value={
                  formData.isPublished
                    ? PUBLISH_STATUS.PUBLISHED
                    : PUBLISH_STATUS.DRAFT
                }
                disabled={status.isLoading}
                name='is_published'
                required
              >
                <SelectTrigger id='is_published'>
                  <SelectValue placeholder='Select status...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PUBLISH_STATUS.PUBLISHED}>
                    Published
                  </SelectItem>
                  <SelectItem value={PUBLISH_STATUS.DRAFT}>Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='publication_date' className='text-xl'>
                Current Publication Date:{' '}
                {issue.publication_date
                  ? new Date(issue.publication_date).toLocaleDateString()
                  : 'none'}
              </Label>
              <Input
                id='publicationDate'
                type='date'
                name='publicationDate'
                value={
                  formData.publicationDate
                    ? formData.publicationDate
                    : new Date().toLocaleDateString()
                }
                onChange={handleInputChange}
              />
            </div>
            <div className='mt-4 min-h-[20px]'>
              {' '}
              {/* Reserve space to prevent layout shifts */}
              {status.error && <p className='text-red-600'>{status.error}</p>}
              {status.success && (
                <p className='text-green-600'>{status.success}</p>
              )}
            </div>
            <p className='mt-2 text-blue-600'>
              Contact an admin if you need to change the following:{' '}
            </p>
            <p className='mx-1 mt-2 text-blue-600'>
              Cover Image: {issue.cover_image_path}
            </p>

            <Button type='submit' size='lg' disabled={status.isLoading}>
              {status.isLoading ? 'processing...' : 'submit'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
