'use client';

import { useTagForm } from '@/hooks/useTagForm';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Tables } from '@/lib/supabase/database/types';

interface TagFormProps {
  mode?: 'create' | 'edit';
  editData?: {
    tag: Tables<'tags'>;
  };
}

export function TagForm(props: TagFormProps) {
  const { mode = 'create', editData } = props;

  const {
    formData,
    status,
    updateField,
    submit,
    isLoading,
    isSuccess,
    isError,
  } = useTagForm({ mode, editData });

  return (
    <section id='form' className='mx-auto max-w-7xl px-4'>
      <h6 className='font-bold'>{mode === 'create' ? 'Create' : 'Edit'} Tag</h6>
      <p>Fields marked with * are required.</p>
      <div className='max-w-7xl'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className='space-y-4'
        >
          <div>
            <Label htmlFor='name'>Name*</Label>
            <Input
              id='name'
              type='text'
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              disabled={isLoading}
              required
              placeholder='e.g., bikini, fancy, swag'
            />
          </div>
          <div className='min-h-5 space-y-2'>
            {isError && status.type === 'error' && (
              <div className='rounded-md bg-red-50 p-4' role='alert'>
                <p className='font-medium text-red-800'>{status.message}</p>
                {status.errors && status.errors.length > 0 && (
                  <ul className='mt-2 list-inside list-disc text-sm text-red-700'>
                    {status.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {isSuccess && status.type === 'success' && (
              <div className='rounded-md bg-green-50 p-4' role='alert'>
                <p className='font-medium text-green-800'>{status.message}</p>
              </div>
            )}
          </div>
          <Button
            type='submit'
            variant='default'
            size='lg'
            disabled={isLoading}
            className='bg-blue-800 text-white'
          >
            {isLoading
              ? 'Processing...'
              : mode === 'create'
                ? 'Create Tag'
                : 'Save Changes'}
          </Button>
        </form>
      </div>
    </section>
  );
}
