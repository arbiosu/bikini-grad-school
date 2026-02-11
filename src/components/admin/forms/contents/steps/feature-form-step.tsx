'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ImageUploader } from '../../storage/image-uploader';
import type { FeatureData } from '@/domain/content/types';

interface FeatureFormStepProps {
  data: Partial<FeatureData>;
  onChange: (data: Partial<FeatureData>) => void;
  disabled?: boolean;
}

export function FeatureFormStep({
  data,
  onChange,
  disabled,
}: FeatureFormStepProps) {
  const images = data.image_urls ?? [];

  const addImage = (url: string | null) => {
    if (!url) return;
    onChange({ ...data, image_urls: [...images, url] });
  };

  const removeImage = (index: number) => {
    onChange({ ...data, image_urls: images.filter((_, i) => i !== index) });
  };

  return (
    <div className='space-y-4'>
      <div>
        <Label htmlFor='description'>Feature Description*</Label>
        <Input
          id='description'
          type='text'
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          disabled={disabled}
          required
          placeholder='Brief description of the feature'
        />
      </div>

      <div className='space-y-3'>
        <Label>Feature Images</Label>

        {/* Existing images */}
        {images.length > 0 && (
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
            {images.map((url, index) => (
              <div
                key={index}
                className='group relative aspect-video overflow-hidden rounded-lg border'
              >
                <img
                  src={url}
                  alt={`Feature image ${index + 1}`}
                  className='h-full w-full object-cover'
                />
                <button
                  type='button'
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                  className='absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Uploader for adding new images */}
        <ImageUploader
          folder='features'
          value={null}
          onChange={addImage}
          label={images.length > 0 ? 'Add another image' : 'Upload an image'}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
