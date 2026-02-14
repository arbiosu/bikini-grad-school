'use client';

import { useIssueForm } from '@/hooks/useIssueForm';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ReviewStep } from './review-step';
import { ImageUploader } from '../storage/image-uploader';
import type { Tables } from '@/lib/supabase/database/types';

interface IssueFormProps {
  mode?: 'create' | 'edit';
  editData?: {
    issue: Tables<'issues'>;
  };
}

export function IssueForm(props: IssueFormProps) {
  const { mode = 'create', editData } = props;

  const {
    formData,
    status,
    updateField,
    submit,
    isLoading,
    isSuccess,
    isError,
  } = useIssueForm({ mode, editData });

  return (
    <section id='form' className='mx-auto max-w-7xl px-4'>
      <h6 className='font-bold'>
        {mode === 'create' ? 'Create' : 'Edit'} Issue
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
          <ImageUploader
            folder='covers'
            value={formData.cover_image}
            onChange={(url) => updateField('cover_image', url)}
            label='Cover Image'
          />
          <div>
            <Label htmlFor='title'>Title* - Case Sensitive</Label>
            <Input
              id='title'
              type='text'
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              disabled={isLoading}
              required
              placeholder='e.g., Obsession, Coquette'
            />
          </div>
          <div>
            <Label htmlFor='issue_number'>Issue Number*</Label>
            <Input
              id='issueNumber'
              type='text'
              value={formData.issue_number}
              onChange={(e) => updateField('issue_number', e.target.value)}
              disabled={isLoading}
              required
              placeholder='e.g., 0.01, 0.1, 0.0001, etc'
            />
          </div>
          <div>
            <Label htmlFor='publication_date'>
              Publication Date* - {formData.publication_date}
            </Label>
            <Input
              id='publication_date'
              type='date'
              value={formData.publication_date}
              onChange={(e) => updateField('publication_date', e.target.value)}
              disabled={isLoading}
            />
          </div>
          {mode === 'edit' && (
            <div className='flex items-center space-x-2'>
              <Switch
                id='published'
                checked={formData.published}
                onCheckedChange={(checked) => updateField('published', checked)}
                disabled={isLoading}
              />
              <Label htmlFor='published'>
                Published:{' '}
                <span className='text-blue-600'>
                  {formData.published ? '(Live)' : '(Draft)'}
                </span>
              </Label>
            </div>
          )}
          {mode === 'create' && (
            <div>
              <Label>Published: (Draft)</Label>
              <p className='text-sm text-gray-500'>
                Issue will be saved as draft on creation
              </p>
            </div>
          )}
          <ReviewStep formData={formData} />
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
                ? 'Create Issue'
                : 'Save Changes'}
          </Button>
        </form>
      </div>
    </section>
  );
}
