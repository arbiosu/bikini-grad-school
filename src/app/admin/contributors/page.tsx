import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createContributorService } from '@/lib/container';
import { redirect } from 'next/navigation';

import { AdminHeader } from '@/components/admin/admin-header';
import { Stats } from '@/components/admin/stats';
import { ContributorTable } from '@/components/admin/contributor-table';

import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contributor Management - BGS Admin',
  description: 'Manage contributors.',
};

export default async function ContributorPage() {
  const supabase = await createServiceClient();
  const service = createContributorService(supabase);

  const result = await service.getAllContributors();

  if (!result.success) {
    redirect('/admin/error');
  }

  const contributors = result.data;
  const totalCount = contributors.length;

  const stats = [
    {
      label: 'Total Contributors',
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
            Contributor Management
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Create, edit, and organize contributors across all BGS content.
          </p>
        </div>

        <Stats stats={stats} />

        <div className='mt-8'>
          <ContributorTable contributors={contributors} />
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
