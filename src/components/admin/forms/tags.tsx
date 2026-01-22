'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { createTag } from '@/lib/supabase/model/tags';

interface CreateTagFormData {
  name: string;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const INITIAL_FORM_DATA: CreateTagFormData = {
  name: '',
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export function CreateTagForm() {
  const [formData, setFormData] =
    useState<CreateTagFormData>(INITIAL_FORM_DATA);
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

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setStatus({
        isLoading: false,
        error: 'Name is required',
        success: null,
      });
      return;
    }
    try {
      const tagData = {
        name: trimmedName,
      };
      const { data, error } = await createTag(tagData);
      if (data) {
        resetForm();
        setStatus({
          isLoading: false,
          error: null,
          success: `Tag ${data.name} has been successfully created!`,
        });
      } else {
        setStatus({ isLoading: false, error: error, success: null });
      }
    } catch (e) {
      let errorMessage =
        'Could not create tag. Please try again or contact an admin.';
      if (e instanceof Error) {
        errorMessage = `Failed to create tag: ${e.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };

  const isSubmitDisabled = status.isLoading || !formData.name.trim();

  return (
    <section id='form' className='mx-auto max-w-7xl px-4'>
      <div className='flex max-w-3xl flex-col pb-5'>
        <h6 className='font-bold'>New Tag Form</h6>
        <p>Fields marked with * are required.</p>
        <p>
          This is a multi-step form. If you need help, refer to the{' '}
          <Link href='#' className='text-blue-600 underline'>
            guide
          </Link>{' '}
          or contact an Admin.
        </p>
      </div>
      <div className='max-w-7xl'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name'>Name* - cAsE SeNsItivE</Label>
            <Input
              id='name'
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              disabled={status.isLoading}
              required
              placeholder='(e.g. Cool, 2020, bikini, CrAzYyyYY)'
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
            size='lg'
            disabled={isSubmitDisabled}
            className='bg-violet-800 text-white'
          >
            {status.isLoading ? 'Processing...' : 'Submit Issue'}
          </Button>
        </form>
      </div>
    </section>
  );
}
