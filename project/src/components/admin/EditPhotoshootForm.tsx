'use client';

import { useCallback, useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  addPhotoToBucket,
  editPhotoshoot,
} from '@/lib/supabase/model/photoshoots';
import { type PhotoshootInsert } from '@/lib/supabase/model/types';

interface EditPhotoshootFormData {
  title: string | undefined;
  description: string | null | undefined;
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
  });
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentFile = e.target.files?.[0] || null;
      setFile(currentFile);
      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );
  const resetFileInput = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isLoading: true, error: null, success: null });
    const newImagesArray = photoshoot.images ? photoshoot.images : [];
    try {
      if (file) {
        const { data: imagePath, error: imageError } = await addPhotoToBucket(
          file,
          '/photoshoots'
        );
        if (imageError || !imagePath) {
          console.error('Could not add photo to bucket');
          setStatus({
            isLoading: false,
            error: 'Could not add this image to the photoshoot.',
            success: null,
          });
          return;
        }
        newImagesArray.push(imagePath);
      }
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
        resetFileInput();
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
            </div>
            <div>
              <Label className='mb-2 block text-lg font-bold text-black'>
                Add an Image to the Photoshoot - upload in order you want it
                presented (ability to change order in future update)
              </Label>
              <Input
                id='image'
                name='image'
                type='file'
                accept='image/png'
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={status.isLoading}
                required
              />
              <p className='mt-1 text-sm text-gray-500'>
                10Mb file size limit. We optimize the image by converting it to
                WebP format and generating 5 cropped versions. Keep filenames
                unique (e.g., article-101.jpg).
              </p>
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
