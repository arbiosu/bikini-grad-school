'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { FileUpload } from '@/domain/storage/types';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 50;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface ImageUploaderProps {
  /** Storage folder for the upload */
  folder: FileUpload['folder'];
  /** Current image URL (for edit forms / controlled usage) */
  value?: string | null;
  /** Called with the public URL after successful upload, or null on remove */
  onChange: (url: string | null) => void;
  /** Optional label text */
  label?: string;
  /** Optional helper text shown below the uploader */
  helperText?: string;
  /** Aspect ratio class for the preview area (Tailwind, e.g. "aspect-square") */
  aspectRatio?: string;
  /** Disable interaction */
  disabled?: boolean;
  /** External error message (e.g. from form validation) */
  error?: string;
}

export function ImageUploader({
  folder,
  value,
  onChange,
  label,
  helperText,
  aspectRatio = 'aspect-video',
  disabled = false,
  error: externalError,
}: ImageUploaderProps) {
  const { upload, isUploading, error: uploadError } = useImageUpload(folder);
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const error = externalError || uploadError;
  const previewUrl = localPreview || value;

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Invalid file type. Accepted: ${ACCEPTED_TYPES.map((t) => t.split('/')[1]).join(', ')}`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        // Surface via the hook's error state isn't possible here,
        // so we just alert — or you could add local error state.
        alert(validationError);
        return;
      }

      // Show instant local preview
      const objectUrl = URL.createObjectURL(file);
      setLocalPreview(objectUrl);

      const publicUrl = await upload(file);

      if (publicUrl) {
        const objectKey = new URL(publicUrl).pathname.slice(1);
        onChange(objectKey);
      } else {
        // Upload failed — revert preview
        setLocalPreview(null);
      }

      URL.revokeObjectURL(objectUrl);
      setLocalPreview(null);
    },
    [upload, onChange, validateFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setLocalPreview(null);
  };

  // Drag & drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const openFilePicker = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className='w-full'>
      {label && (
        <label className='mb-1.5 block text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}

      <div
        role='button'
        tabIndex={disabled ? -1 : 0}
        aria-label={previewUrl ? 'Change image' : 'Upload image'}
        aria-disabled={disabled || isUploading}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFilePicker();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-lg border-2 border-dashed transition-all ${aspectRatio} ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        } ${disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'} focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none`}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type='file'
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleInputChange}
          className='hidden'
          disabled={disabled || isUploading}
        />

        {previewUrl ? (
          /* ── Preview state ── */
          <div className='group relative h-full w-full'>
            <Image
              src={previewUrl}
              alt='Uploaded image'
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 50vw'
            />

            {/* Hover overlay */}
            {!isUploading && (
              <div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/0 transition-colors group-hover:bg-black/40'>
                <span className='rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100'>
                  Replace
                </span>
                <button
                  type='button'
                  onClick={handleRemove}
                  className='rounded-md bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-600'
                >
                  Remove
                </button>
              </div>
            )}

            {/* Upload progress overlay */}
            {isUploading && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                <div className='flex flex-col items-center gap-2'>
                  <Spinner />
                  <span className='text-sm font-medium text-white'>
                    Uploading…
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Empty / drop state ── */
          <div className='flex h-full flex-col items-center justify-center gap-2 p-6'>
            {isUploading ? (
              <>
                <Spinner />
                <span className='text-sm text-gray-500'>Uploading…</span>
              </>
            ) : (
              <>
                <UploadIcon className='h-8 w-8 text-gray-400' />
                <div className='text-center'>
                  <span className='text-sm font-medium text-blue-600'>
                    Click to upload
                  </span>
                  <span className='text-sm text-gray-500'> or drag & drop</span>
                </div>
                <span className='text-xs text-gray-400'>
                  PNG, JPG, WebP, GIF up to {MAX_SIZE_MB}MB
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Error / helper text */}
      {error && <p className='mt-1.5 text-sm text-red-600'>{error}</p>}
      {!error && helperText && (
        <p className='mt-1.5 text-sm text-gray-500'>{helperText}</p>
      )}
    </div>
  );
}

/* ── Inline icons ── */

function Spinner() {
  return (
    <svg
      className='h-6 w-6 animate-spin text-white'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      />
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
      />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
      />
    </svg>
  );
}
