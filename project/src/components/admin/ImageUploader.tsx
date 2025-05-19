'use client';

import { useState, useRef, useCallback } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { generateSignedUploadUrl } from '@/lib/supabase/model/storage';

interface ImageFormData {
  image: File | null;
  caption: string;
  credit: string;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

const INITIAL_FORM_DATA: ImageFormData = {
  image: null,
  caption: '',
  credit: '',
};

export default function UploadImageForm({
  folder,
  onUpload,
}: {
  folder: string;
  onUpload: (url: string) => void;
}) {
  const [formData, setFormData] = useState<ImageFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setFormData((prevData) => ({
        ...prevData,
        image: currentFile,
      }));
      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isLoading: true, error: null, success: null });

    if (!formData.image) {
      setStatus({
        isLoading: false,
        error: 'No image selected. Please select an image.',
        success: null,
      });
      return;
    }
    if (!formData.caption || !formData.credit) {
      setStatus({
        isLoading: false,
        error:
          'Caption or Credit is empty! If no caption or credit, enter an empty space',
        success: null,
      });
      return;
    }
    const filename = formData.image.name;
    const trimmedFilename = filename.replace(/\.[^.]+$/, '');

    try {
      const { data: signedUrl, error: signedUrlError } =
        await generateSignedUploadUrl(`${folder}/${trimmedFilename}`);
      if (signedUrlError) {
        setStatus({
          isLoading: false,
          error: signedUrlError,
          success: null,
        });
        return;
      }
      if (signedUrl) {
        setStatus({
          isLoading: true,
          error: null,
          success: `URL Generated. Uploading...`,
        });
        const supabase = createClient();
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .uploadToSignedUrl(signedUrl.path, signedUrl.token, formData.image, {
            cacheControl: '31536000',
            metadata: {
              caption: formData.caption,
              credit: formData.credit,
            },
          });
        if (uploadError) {
          setStatus({
            isLoading: false,
            error: `Upload failed: ${uploadError}`,
            success: null,
          });
          return;
        }
        if (uploadData) {
          onUpload(uploadData.path);
          setStatus({
            isLoading: false,
            error: null,
            success: `Image has been uploaded! PATH: ${uploadData.path}. Resizing images...`,
          });
          // call api?
          const res = await fetch('/api/images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imagePath: uploadData.path }),
          });

          if (!res.ok) {
            setStatus({
              isLoading: false,
              error: 'Could not resize images!',
              success: null,
            });
            return;
          }

          const resData = await res.json();

          // -- All successes
          setStatus({
            isLoading: false,
            error: null,
            success: `Upload fully success! Image has been uploaded and resized. FULL PATH URL (for use in linking to articles): ${uploadData.fullPath} PATH: ${uploadData.path} RESIZED: ${resData}`,
          });
          resetForm();
          return;
        }
      }
    } catch (error) {
      console.log(error);
      let errMsg = 'ERROR: ';
      if (error instanceof Error) {
        errMsg += error.message;
      }
      setStatus({ isLoading: false, error: errMsg, success: null });
    }
  };
  const isSubmitDisabled = status.isLoading;
  return (
    <div>
      <h2></h2>
      <div>
        <div>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='image' className='text-xl'>
                Image*
              </Label>
              <Input
                id='image'
                name='image'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={status.isLoading}
                required
              />
              <p className='mt-1 text-sm text-gray-500'>
                50Mb file size limit - please wait until upload is complete -
                you will see a green success message with the images path. Keep
                that path handy for when you want to add that image to an
                article or photoshoot.
              </p>
            </div>
            <div>
              <Label htmlFor='caption' className='text-xl'>
                Caption*
              </Label>
              <Input
                id='caption'
                name='caption'
                type='text'
                value={formData.caption}
                onChange={handleInputChange}
                placeholder='Caption for the image'
                disabled={status.isLoading}
                required
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='credit' className='text-xl'>
                Credit*
              </Label>
              <Input
                id='credit'
                name='credit'
                type='text'
                value={formData.credit}
                onChange={handleInputChange}
                placeholder='Image credits'
                disabled={status.isLoading}
                required
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
              {status.isLoading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
