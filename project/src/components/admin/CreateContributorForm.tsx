'use client';

import { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createContributor } from '@/lib/supabase/model/contributors';

interface ContributorFormData {
  name: string;
  bio: string;
  type: string;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const INITIAL_FORM_DATA: ContributorFormData = {
  name: '',
  bio: '',
  type: '',
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export default function CreateNewContributorForm() {
  const [formData, setFormData] =
    useState<ContributorFormData>(INITIAL_FORM_DATA);
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
      const contributorData = {
        name: trimmedName,
        bio: formData.bio.trim(),
        type: formData.type.trim(),
      };
      const { data, error } = await createContributor(contributorData);
      if (data) {
        resetForm();
        setStatus({
          isLoading: false,
          error: null,
          success: 'Contributor created successfully!',
        });
      } else {
        setStatus({ isLoading: false, error: error, success: null });
      }
    } catch (error) {
      console.error('Failed to create contributor:', error);
      let errorMessage =
        'Could not create contributor. Please try again or contact support.';
      if (error instanceof Error) {
        errorMessage = `Failed to create contributor: ${error.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };
  const isSubmitDisabled = status.isLoading || !formData.name.trim();

  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h2 className='mb-6 text-2xl font-semibold'>Create New Contributor</h2>
      <p className='mb-6 text-sm text-gray-600'>
        Fill in the details for the new contributor Fields marked with * are
        required.
      </p>

      <div className='flex flex-col gap-24 md:flex-row'>
        <div className='flex-1'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='name' className='text-xl'>
                Name*
              </Label>
              <Input
                id='name'
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                placeholder='Enter the contributors name'
                disabled={status.isLoading}
                required
                className='mt-1'
              />
              <p className='mt-1 text-sm text-gray-500'>
                Note: Name is case sensitive
              </p>
            </div>
            <div>
              <Label htmlFor='bio' className='text-xl'>
                bio
              </Label>
              <Input
                id='bio'
                type='text'
                name='bio'
                value={formData.bio}
                onChange={handleInputChange}
                placeholder='Optionally enter a bio for the contributor'
                disabled={status.isLoading}
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='type' className='text-xl'>
                Type
              </Label>
              <Input
                id='type'
                type='text'
                name='type'
                value={formData.type}
                onChange={handleInputChange}
                placeholder='Optionally enter a type for the contributor (e.g. author, model, artist)'
                disabled={status.isLoading}
                className='mt-1'
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
              {status.isLoading ? 'Processing...' : 'Submit Contributor'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
