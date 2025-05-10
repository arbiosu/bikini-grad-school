'use client';

import { useState, useCallback } from 'react';
import { assignPhotoshootContributor } from '@/lib/supabase/model/photoshootContributors';
import type {
  Contributor,
  Role,
  PhotoshootContributor,
} from '@/lib/supabase/model/types';
import ContributorSelector from './ContributorSelector';
import RoleSelector from './RoleSelector';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PhotoshootContributorFormData {
  contributorId: string;
  roleId: number;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

interface CreatePhotoshootContributorProps {
  contributors: Contributor[];
  roles: Role[];
  photoshootId: string;
}

const INITIAL_FORM_DATA: PhotoshootContributorFormData = {
  contributorId: '',
  roleId: 0,
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export default function CreateNewPhotoshootContributorForm({
  photoshootId,
  contributors,
  roles,
}: CreatePhotoshootContributorProps) {
  const [formData, setFormData] =
    useState<PhotoshootContributorFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);

  const handleContributorChange = useCallback(
    (id: string) => {
      setFormData((prevData) => ({
        ...prevData,
        contributorId: id,
      }));
      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );
  const handleRoleChange = useCallback(
    (id: string) => {
      setFormData((prevData) => ({
        ...prevData,
        roleId: parseInt(id),
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

    if (formData.contributorId === '' || formData.roleId === 0) {
      setStatus({
        isLoading: false,
        error: 'Invalid submission: One or more fields were empty or invalid.',
        success: null,
      });
      return;
    }
    try {
      const pcData: PhotoshootContributor = {
        contributor_id: formData.contributorId,
        photoshoot_id: photoshootId,
        role_id: formData.roleId,
      };
      const { data: pc, error: pcError } =
        await assignPhotoshootContributor(pcData);
      if (pc) {
        setStatus({
          isLoading: false,
          error: null,
          success: 'Successfully added this contributor to the photoshoot!',
        });
        resetForm();
      } else {
        setStatus({ isLoading: false, error: pcError, success: null });
      }
    } catch (error) {
      console.error(error);
      let errorMessage =
        'Could not add contributor to the photoshoot. Contact an admin.';
      if (error instanceof Error) {
        errorMessage = `Failed to create photoshoot_contributor: ${error.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };
  const isSubmitDisabled = status.isLoading;
  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h2 className='mb-6 text-2xl font-semibold'>
        Add a contributor to the photoshoot
      </h2>
      <p className='mb-6 text-sm text-gray-600'>
        Assign the contributor along with their role. Fields marked with * are
        required.
      </p>

      <div className='flex flex-col gap-24 md:flex-row'>
        <div className='flex-1'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='contributorId' className='text-xl'>
                Assign the contributor from our list of Contributors
              </Label>
              <ContributorSelector
                data={contributors}
                handleChange={handleContributorChange}
              />
            </div>
            <div>
              <Label htmlFor='roleId' className='text-xl'>
                {"Assign the contributor's role"}
              </Label>
              <RoleSelector data={roles} handleChange={handleRoleChange} />
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
              {status.isLoading ? 'Processing...' : 'Assign Contributor'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
