import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getImagesFromFolder } from '@/actions/storage';

import { AdminHeader } from '@/components/admin/admin-header';
import { ImageTable } from '@/components/admin/image-table';
import { Stats } from '@/components/admin/stats';
import { Image } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Image Management - BGS Admin',
  description: 'Manage all BGS images.',
};

export default async function ImagePage() {
  const [addons, covers, features, site, subscriptions] = await Promise.all([
    getImagesFromFolder('addons'),
    getImagesFromFolder('covers'),
    getImagesFromFolder('features'),
    getImagesFromFolder('public'),
    getImagesFromFolder('subscriptions'),
  ]);

  if (
    !addons.success ||
    !covers.success ||
    !features.success ||
    !site.success ||
    !subscriptions.success
  ) {
    redirect('/admin/error');
  }

  const all = [
    addons.data,
    covers.data,
    features.data,
    site.data,
    subscriptions.data,
  ];

  const flat = all.flat().filter((item) => item.size > 0);

  const allCount = flat.length;

  const stats = [
    {
      label: 'Total Images',
      value: allCount,
      icon: Image,
    },
  ];

  return (
    <div className='bg-background min-h-screen'>
      <AdminHeader breadcrumbs={[{ label: 'Images' }]} />
      <main className='mx-auto max-w-7xl px-6 py-8 lg:px-8'>
        <div className='mb-8'>
          <h2 className='text-foreground text-2xl font-semibold tracking-tight text-balance'>
            Image Management
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Create, edit, and organize Images.
          </p>
        </div>

        <Stats stats={stats} />

        <div className='mt-8'>
          <ImageTable images={flat} />
        </div>

        <footer className='border-border mt-12 border-t pt-6 pb-8'>
          <p className='text-muted-foreground text-xs'>
            BGS Admin Portal &middot; Content Management System
          </p>
        </footer>
      </main>
    </div>
  );
}
