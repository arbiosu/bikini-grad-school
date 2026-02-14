import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createTagService } from '@/lib/container';
import { redirect } from 'next/navigation';

import { AdminHeader } from '@/components/admin/admin-header';
import { Stats } from '@/components/admin/stats';
import { TagTable } from '@/components/admin/tag-table';

import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tag Management - BGS Admin',
  description: 'Manage content tags.',
};

export default async function RolePage() {
  const supabase = await createServiceClient();
  const service = createTagService(supabase);

  const result = await service.getAllTags();

  if (!result.success) {
    redirect('/admin/error');
  }

  const tags = result.data;
  const totalCount = tags.length;

  const stats = [
    {
      label: 'Total Tags',
      value: totalCount,
      icon: Users,
    },
  ];
  return (
    <div className='bg-background min-h-screen'>
      <AdminHeader breadcrumbs={[{ label: 'Content' }]} />
      <main className='mx-auto max-w-7xl px-6 py-8 lg:px-8'>
        <div className='mb-8'>
          <h2 className='text-foreground text-2xl font-semibold tracking-tight text-balance'>
            Content Tags Management
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Create, edit, and organize content tags across all BGS content.
          </p>
        </div>

        <Stats stats={stats} />

        <div className='mt-8'>
          <TagTable tags={tags} />
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
