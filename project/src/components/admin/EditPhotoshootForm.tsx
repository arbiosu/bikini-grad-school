'use client';

import { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { editPhotoshoot } from '@/lib/supabase/model/photoshoots';
import { type PhotoshootInsert } from '@/lib/supabase/model/types';
import UploadImageForm from './ImageUploader';

interface EditPhotoshootFormData {
  title?: string;
  description?: string | null;
  images?: string[];
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

interface PhotoshootProps {
  photoshoot: PhotoshootInsert;
}

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export default function EditPhotoshootForm({ photoshoot }: PhotoshootProps) {
  const [formData, setFormData] = useState<EditPhotoshootFormData>({
    title: photoshoot.title,
    description: photoshoot.description,
    images: photoshoot.images,
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

  const handleImageUpload = useCallback(
    (url: string) => {
      const newImagesArray = formData.images
        ? [...formData.images, ...url]
        : [url];
      setFormData((prevData) => ({ ...prevData, images: newImagesArray }));
    },
    [formData.images]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isLoading: true, error: null, success: null });
    const newImagesArray = photoshoot.images ? photoshoot.images : [];
    try {
      const editedPhotoshoot = await editPhotoshoot({
        title: formData.title,
        description: formData.description,
        id: photoshoot.id,
        images: newImagesArray,
      });
      if (editedPhotoshoot.data) {
        setStatus({
          isLoading: false,
          error: null,
          success: 'Photoshoot updated successfully!',
        });
      } else {
        setStatus({
          isLoading: false,
          error: editedPhotoshoot.error,
          success: null,
        });
      }
    } catch (error) {
      console.error(error);
      let errorMessage = 'Could not edit photoshoot. Contact an admin.';
      if (error instanceof Error) {
        errorMessage = `Failed to edit photoshoot: ${error.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };
  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h2 className='mb-6 text-2xl font-semibold'>Edit Photoshoot</h2>
      <div className='flex flex-col gap-24 md:flex-row'>
        <div className='flex-1'>
          <div className='mb-12'>
            <UploadImageForm
              folder='/photoshoots'
              onUpload={handleImageUpload}
            />
          </div>
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
                disabled={status.isLoading}
                required
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='description' className='text-xl'>
                Description
              </Label>
              <Input
                id='description'
                type='text'
                name='description'
                value={formData.description ? formData.description : ''}
                onChange={handleInputChange}
                disabled={status.isLoading}
                className='mt-1'
              />
            </div>
            <div>
              <p className='text-xl'>Current images: {photoshoot.images}</p>
              {photoshoot.images ? (
                photoshoot.images.map((image, index) => (
                  <p key={index}>{image}</p>
                ))
              ) : (
                <p>None</p>
              )}
            </div>

            <div className='mt-4 min-h-[20px]'>
              {' '}
              {/* Reserve space to prevent layout shifts */}
              {status.error && <p className='text-red-600'>{status.error}</p>}
              {status.success && (
                <p className='text-green-600'>{status.success}</p>
              )}
            </div>
            <Button type='submit' size='lg' disabled={status.isLoading}>
              {status.isLoading ? 'processing...' : 'submit'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
