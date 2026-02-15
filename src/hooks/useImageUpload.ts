import { useState } from 'react';
import { getUploadUrlAction } from '@/actions/storage';
import type { FileUpload } from '@/domain/storage/types';

export function useImageUpload(folder: FileUpload['folder']) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<string | null> {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get presigned URL from server
      const result = await getUploadUrlAction({
        filename: file.name,
        contentType: file.type,
        size: file.size,
        folder,
      });

      if (!result.success) {
        setError(result.error.message);
        return null;
      }

      // 2. Upload directly to R2
      const response = await fetch(result.data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        if (!response.ok) {
          const text = await response.text();
          console.error('Upload failed:', response.status, text);
          setError(`Upload failed: ${response.status}`);
          return null;
        }
        return null;
      }
      return result.data.publicUrl;
    } catch (err) {
      setError('Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  return { upload, isUploading, error };
}
