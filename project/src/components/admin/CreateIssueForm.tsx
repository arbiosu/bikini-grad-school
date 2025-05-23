'use client';

import { useState, useCallback } from 'react';
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
import UploadImageForm from './ImageUploader';
import { createIssue } from '@/lib/supabase/model/issues';

interface IssueFormData {
  title: string;
  description: string;
  isPublished: boolean;
  publicationDate: string;
  coverImgPath: string;
  issueNumber: number;
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

const INITIAL_FORM_DATA: IssueFormData = {
  title: '',
  description: '',
  isPublished: false,
  publicationDate: new Date().toLocaleDateString(),
  coverImgPath: '',
  issueNumber: 0,
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export default function CreateNewIssueForm() {
  const [formData, setFormData] = useState<IssueFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);

  const handleImageUpload = useCallback((url: string) => {
    setFormData((prevData) => ({ ...prevData, coverImgPath: url }));
  }, []);

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

    try {
      const issueData = {
        title: trimmedTitle,
        description: formData.description.trim(),
        is_published: formData.isPublished,
        publication_date: formData.publicationDate,
        cover_image_path: formData.coverImgPath,
        issue_number: formData.issueNumber,
      };
      const { data, error } = await createIssue(issueData);
      if (data) {
        resetForm();
        setStatus({
          isLoading: false,
          error: null,
          success: 'Issue created successfully!',
        });
      } else {
        setStatus({ isLoading: false, error: error, success: null });
      }
    } catch (error) {
      console.error('Failed to create issue:', error);
      let errorMessage =
        'Could not create issue. Please try again or contact support.';
      if (error instanceof Error) {
        errorMessage = `Failed to create issue: ${error.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };
  const isSubmitDisabled = status.isLoading || !formData.title.trim();

  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h2 className='mb-6 text-2xl font-semibold'>Create New Issue</h2>
      <p className='mb-6 text-sm text-gray-600'>
        Fill in the details for the new magazine issue. Upload the cover image
        first. Fields marked with * are required.
      </p>

      <div className='flex flex-col gap-24 md:flex-row'>
        <div className='flex-1'>
          <div className='mb-12'>
            <UploadImageForm folder='/content' onUpload={handleImageUpload} />
          </div>

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
                placeholder='Enter the issue title (e.g., obsession, coquette)'
                disabled={status.isLoading}
                required
                className='mt-1'
              />
              <p className='mt-1 text-sm text-gray-500'>
                Note: Title is case sensitive
              </p>
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
                placeholder='Optionally enter the issue description'
                disabled={status.isLoading}
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='issueNumber' className='text-xl'>
                Issue Number
              </Label>
              <Input
                id='issueNumber'
                type='number'
                name='issueNumber'
                value={formData.issueNumber}
                onChange={handleInputChange}
                placeholder='Optionally enter the issue description'
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
              <p className='mt-1 text-sm text-gray-500'>
                {
                  "'Published' issues are live immediately. 'Draft' issues are hidden."
                }
              </p>
            </div>
            <div>
              <Label htmlFor='publication_date' className='text-xl'>
                Publication Date: {formData.publicationDate}
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
              {/* Reserve space to prevent layout shifts */}
              {status.error && <p className='text-red-600'>{status.error}</p>}
              {status.success && (
                <p className='text-green-600'>{status.success}</p>
              )}
            </div>
            <Button type='submit' size='lg' disabled={isSubmitDisabled}>
              {status.isLoading ? 'Processing...' : 'Submit Issue'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
