'use client';

import { useContributorForm } from '@/hooks/useContributorForm';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/admin/forms/storage/image-uploader';
import type { SocialLinks } from '@/domain/contributors/types';
import type { Tables } from '@/lib/supabase/database/types';

interface ContributorFormProps {
  mode?: 'create' | 'edit';
  editData?: {
    contributor: Tables<'contributors'>;
  };
}

export function ContributorForm(props: ContributorFormProps) {
  const { mode = 'create', editData } = props;

  const {
    formData,
    status,
    updateField,
    submit,
    isLoading,
    isSuccess,
    isError,
  } = useContributorForm({ mode, editData });

  const updateSocialLink = (platform: keyof SocialLinks, value: string) => {
    updateField('social_links', {
      ...formData.social_links,
      [platform]: value || undefined,
    });
  };

  return (
    <section id='form' className='mx-auto max-w-7xl px-4'>
      <h6 className='font-bold'>
        {mode === 'create' ? 'Create' : 'Edit'} Contributor
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
              placeholder='e.g., Arberim Ame, Jayne Baran, Kelly Slater'
            />
          </div>
          <div>
            <Label htmlFor='bio'>Bio</Label>
            <Input
              id='bio'
              type='text'
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              disabled={isLoading}
              placeholder='e.g., Founder of Bikini Grad School'
            />
          </div>
          <div>
            <ImageUploader
              folder='avatars'
              value={formData.avatar}
              onChange={(url) => updateField('avatar', url || '')}
              label='Avatar/Profile Image'
            />
            <p className='text-s text-gray-400 dark:text-gray-200'>
              Will be cropped similar to a social media profile picture
            </p>
          </div>
          <div className='space-y-3'>
            <Label>Social Links</Label>
            <div>
              <Label htmlFor='instagram'>Instagram</Label>
              <Input
                id='instagram'
                type='url'
                value={formData.social_links.instagram ?? ''}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                disabled={isLoading}
                placeholder='https://instagram.com/username'
              />
            </div>
            <div>
              <Label htmlFor='twitter'>Twitter / X</Label>
              <Input
                id='twitter'
                type='url'
                value={formData.social_links.twitter ?? ''}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                disabled={isLoading}
                placeholder='https://x.com/username'
              />
            </div>
            <div>
              <Label htmlFor='tiktok'>TikTok</Label>
              <Input
                id='tiktok'
                type='url'
                value={formData.social_links.tiktok ?? ''}
                onChange={(e) => updateSocialLink('tiktok', e.target.value)}
                disabled={isLoading}
                placeholder='https://tiktok.com/@username'
              />
            </div>
            <div>
              <Label htmlFor='website'>Website</Label>
              <Input
                id='website'
                type='url'
                value={formData.social_links.website ?? ''}
                onChange={(e) => updateSocialLink('website', e.target.value)}
                disabled={isLoading}
                placeholder='https://example.com'
              />
            </div>
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
                ? 'Create Contributor'
                : 'Save Changes'}
          </Button>
        </form>
      </div>
    </section>
  );
}
