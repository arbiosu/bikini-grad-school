'use client';

import { useState, useCallback } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { createRole } from '@/lib/supabase/model/roles';

interface CreateCreativeRoleFormData {
  name: string;
  description: string;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const INITIAL_FORM_DATA: CreateCreativeRoleFormData = {
  name: '',
  description: '',
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export function CreateCreativeRoleForm() {
  const [formData, setFormData] =
    useState<CreateCreativeRoleFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);

  const handleFieldChange = useCallback(
    (field: keyof CreateCreativeRoleFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
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
      setStatus({ isLoading: false, error: 'Name is required', success: null });
      return;
    }

    try {
      const data = {
        name: trimmedName,
        description: formData.description.trim(),
      };
      const { data: insertData, error } = await createRole(data);
      if (insertData) {
        resetForm();
        setStatus({
          isLoading: false,
          error: null,
          success: `Creative Role ${trimmedName} has been added!`,
        });
      } else {
        setStatus({ isLoading: false, error: error, success: null });
      }
    } catch (e) {
      let errorMessage =
        'Could not create role. Please try again or contact an admin.';
      if (e instanceof Error) {
        errorMessage = `Failed to create roel: ${e.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };

  const isSubmitDisabled = status.isLoading || !formData.name.trim();

  return (
    <section id='creativeRoleForm'>
      <div className='flex justify-center'>
        <h1 className='mb-4 text-xl'>New Creative Role Form</h1>
      </div>
      <div className='max-w-full'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name'>Name* - cAsE SeNsItivE</Label>
            <Input
              id='name'
              type='text'
              name='name'
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              disabled={status.isLoading}
              required
              placeholder='(e.g., Photography, Author)'
            />
          </div>
          <div>
            <Label htmlFor='title'>Description</Label>
            <Input
              id='description'
              type='text'
              name='description'
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              disabled={status.isLoading}
              required
              placeholder='(e.g., the photographer of the shoot, etc)'
            />
          </div>
          <div className='mt-4 min-h-[20px]'>
            {' '}
            {status.error && (
              <p className='text-red-600'>ERROR: {status.error}</p>
            )}
            {status.success && (
              <p className='text-green-600'>SUCCESS: {status.success}</p>
            )}
          </div>
          <Button
            type='submit'
            variant={'outline'}
            size='lg'
            disabled={isSubmitDisabled}
            className='bg-emerald-600 disabled:bg-emerald-600/10'
          >
            {status.isLoading ? 'Processing...' : 'Submit Creative Role'}
          </Button>
        </form>
      </div>
    </section>
  );
}
