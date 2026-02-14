'use client';

import { useTierForm } from '@/hooks/subscriptions/useTiersForm';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/admin/forms/storage/image-uploader';
import type { TierWithPrices } from '@/domain/subscriptions/types';

interface TierFormProps {
  mode?: 'create' | 'edit';
  editData?: TierWithPrices;
}

export function TierForm(props: TierFormProps) {
  const { mode = 'create', editData } = props;

  const {
    formData,
    status,
    updateField,
    submit,
    isLoading,
    isSuccess,
    isError,
  } = useTierForm({ mode, editData });

  return (
    <section id='form' className='mx-auto max-w-7xl px-4'>
      <h6 className='font-bold'>
        {mode === 'create' ? 'Create' : 'Edit'} Tier
      </h6>
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
              placeholder='Mama Zine'
            />
          </div>
          <div>
            <Label htmlFor='description'>Description*</Label>
            <Input
              id='description'
              type='text'
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              disabled={isLoading}
              required
              placeholder='You receive the zine of the cycle + 1 add on of your choice'
            />
          </div>
          <div>
            <Label htmlFor='addon_slots'>Add On Slots*</Label>
            <Input
              id='addon_slots'
              type='number'
              value={formData.addon_slots}
              onChange={(e) =>
                updateField('addon_slots', e.target.valueAsNumber)
              }
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <Label htmlFor='monthly_price'>Monthly Price in Dollars*</Label>
            <Input
              id='monthly_price'
              type='number'
              inputMode='decimal'
              step='0.01'
              min='0'
              value={formData.monthly_price / 100}
              onChange={(e) =>
                updateField('monthly_price', Number(e.target.value) * 100)
              }
              disabled={isLoading || mode === 'edit'}
              required
            />
          </div>
          <div>
            <Label htmlFor='annual_price'>Annual Price in Dollars*</Label>
            <Input
              id='annual_price'
              type='number'
              inputMode='decimal'
              step='0.01'
              min='0'
              value={formData.annual_price / 100}
              onChange={(e) =>
                updateField('annual_price', Number(e.target.value) * 100)
              }
              disabled={isLoading || mode === 'edit'}
              required
            />
          </div>
          <div>
            <Label htmlFor='image_url'>Display Image*</Label>
            <ImageUploader
              folder='covers'
              value={formData.image_url}
              onChange={(url) => updateField('image_url', url ?? '')}
            />
          </div>
          {/* Status Messages */}
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
                ? 'Create Tier'
                : 'Save Changes'}
          </Button>
        </form>
      </div>
    </section>
  );
}
