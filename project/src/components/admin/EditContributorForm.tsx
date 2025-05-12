'use client';

import { useState, useCallback } from 'react';
import { type Contributor } from '@/lib/supabase/model/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { editContributor } from '@/lib/supabase/model/contributors';

interface EditContributorFormData {
  name: string;
  bio: string | null;
  type: string | null;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

interface EditContributorProps {
  contributor: Contributor;
}

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export default function EditContributorForm({
  contributor,
}: EditContributorProps) {
  const [formData, setFormData] = useState<EditContributorFormData>({
    name: contributor.name,
    bio: contributor.bio,
    type: contributor.type,
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
      const now = new Date();
      const updated = now.toISOString();
      const contributorData = {
        id: contributor.id,
        name: trimmedName,
        bio: formData.bio ? formData.bio.trim() : null,
        type: formData.type ? formData.type.trim() : null,
        updated_at: updated,
      };
      const { data, error } = await editContributor(contributorData);
      if (data) {
        setStatus({
          isLoading: false,
          error: null,
          success: 'Contributor edited successfully!',
        });
      } else {
        setStatus({ isLoading: false, error: error, success: null });
      }
    } catch (error) {
      console.error('Failed to edit contributor:', error);
      let errorMessage =
        'Could not edit contributor. Please try again or contact support.';
      if (error instanceof Error) {
        errorMessage = `Failed to edit contributor: ${error.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };
  const isSubmitDisabled = status.isLoading || !formData.name.trim();

  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h2 className='mb-6 text-2xl font-semibold'>
        Edit Contributor: {contributor.name}
      </h2>
      <p className='mb-6 text-sm text-gray-600'>
        Fields marked with * are required.
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
                value={formData.bio ? formData.bio : ''}
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
                value={formData.type ? formData.type : ''}
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
