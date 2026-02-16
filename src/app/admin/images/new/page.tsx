'use client';

import { ImageUploader } from '@/components/admin/forms/storage/image-uploader';
import BackButton from '@/components/back-button';

export default function Page() {
  return (
    <section className='mx-auto w-full max-w-7xl'>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/images/' label='Back' />
      </div>
      <ImageUploader
        folder='public'
        onChange={() => {}}
        label='For uploading standalone images in our public folder. Use for article body, static images on site '
      />
    </section>
  );
}
