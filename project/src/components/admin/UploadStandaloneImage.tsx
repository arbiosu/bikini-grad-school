'use client';

import UploadImageForm from '@/components/admin/ImageUploader';

export default function UploadStandaloneImage() {
  return (
    <UploadImageForm
      folder='/content'
      onUpload={(url: string) => console.log(url)}
    />
  );
}
