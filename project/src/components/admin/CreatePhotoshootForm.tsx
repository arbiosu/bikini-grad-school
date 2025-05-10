'use client';

import { useState, useRef, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import IssueSelector from './IssueSelector';
import { createPhotoshoot } from '@/lib/supabase/model/photoshoots';
import { type Issue } from '@/lib/supabase/model/types';

interface PhotoshootFormData {
  title: string;
  description: string;
  images: string[];
  issueId: number;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

interface IssuesProps {
  issues: Issue[];
}

const INITIAL_FORM_DATA: PhotoshootFormData = {
  title: '',
  description: '',
  images: [],
  issueId: 1,
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export default function CreateNewPhotoshootForm({ issues }: IssuesProps) {
  const [formData, setFormData] =
    useState<PhotoshootFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentFile = e.target.files?.[0] || null;
      setFile(currentFile);
      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

  const handleIssueIdChange = useCallback(
    (id: string) => {
      setFormData((prevData) => ({
        ...prevData,
        issueId: parseInt(id),
      }));
      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    if (!file) {
      setStatus({
        isLoading: false,
        error: 'Please upload a cover image',
        success: null,
      });
      return;
    }
    try {
      const photoshootData = {
        title: trimmedTitle,
        description: formData.description.trim(),
        issue_id: formData.issueId,
      };
      const { data, error } = await createPhotoshoot(photoshootData, file);
      if (data) {
        resetForm();
        setStatus({
          isLoading: false,
          error: null,
          success: 'Photoshoot created successfully!',
        });
      } else {
        setStatus({ isLoading: false, error: error, success: null });
      }
    } catch (err) {
      console.error('Failed to create photoshoot:', err);
      let errorMessage =
        'Could not create photoshoot. Please try again or contact support.';
      if (err instanceof Error) {
        errorMessage = `Failed to create photoshoot: ${err.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };

  const isSubmitDisabled = status.isLoading || !file || !formData.title.trim();
  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h2 className='mb-6 text-2xl font-semibold'>Create New Photoshoot</h2>
      <p className='mb-6 text-sm text-gray-600'>
        Fill in the details for the new magazine photoshoot. Fields marked with
        * are required.
      </p>

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
                placeholder='Enter the photoshoot title'
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
              <Label htmlFor='issueId' className='text-xl'>
                Set which issue this article belongs to
              </Label>
              <IssueSelector data={issues} handleChange={handleIssueIdChange} />
            </div>
            <div>
              <Label
                htmlFor='coverImage'
                className='mb-2 block text-lg font-bold text-black'
              >
                Image*
              </Label>
              <Input
                id='coverImage'
                name='coverImage'
                type='file'
                accept='image/png'
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={status.isLoading}
                required
              />
              <p className='mt-1 text-sm text-gray-500'>
                10Mb file size limit. We optimize the image by converting it to
                WebP format and generating 5 cropped versions. Keep filenames
                unique (e.g., issue-101.jpg).
              </p>
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
