import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createTierService } from '@/lib/container';

import { AdminHeader } from '@/components/admin/admin-header';
import { TierTable } from '@/components/admin/tiers-table';
import { Stats } from '@/components/admin/stats';
import { FileText, CheckCircle2, PenLine } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Subscription Tier Management - BGS Admin',
  description: 'Manage all BGS issues.',
};

export default async function TierPage() {
  const supabase = await createServiceClient();
  const service = createTierService(supabase);

  const result = await service.list(false);

  if (!result.success) {
    redirect('/admin/error');
  }

  const tiers = result.data;
  const count = tiers.length;
  const activeCount = tiers.filter((t) => t.is_active).length;
  const inactiveCount = count - activeCount;

  const stats = [
    {
      label: 'Total Tiers',
      value: count,
      icon: FileText,
    },
    {
      label: 'Active',
      value: activeCount,
      icon: CheckCircle2,
    },
    {
      label: 'Inactive',
      value: inactiveCount,
      icon: PenLine,
    },
  ];

  return (
    <div className='bg-background min-h-screen'>
      <AdminHeader
        breadcrumbs={[{ label: 'Subscriptions' }, { label: 'Tiers' }]}
      />
      <main className='mx-auto max-w-7xl px-6 py-8 lg:px-8'>
        <div className='mb-8'>
          <h2 className='text-foreground text-2xl font-semibold tracking-tight text-balance'>
            Tier Management
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Create, edit, and organize issues.
          </p>
        </div>

        <Stats stats={stats} />

        <div className='mt-8'>
          <TierTable tiers={tiers} />
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
