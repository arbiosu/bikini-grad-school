import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createAddonProductService } from '@/lib/container';

import { AdminHeader } from '@/components/admin/admin-header';
import { AddonProductTable } from '@/components/admin/addon-product-table';
import { Stats } from '@/components/admin/stats';
import { FileText, CheckCircle2, PenLine } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Subscription Addon Management - BGS Admin',
  description: 'Manage all BGS shop add ons.',
};

export default async function AddonPage() {
  const supabase = await createServiceClient();
  const service = createAddonProductService(supabase);

  const result = await service.list(false);

  if (!result.success) {
    redirect('/admin/error');
  }

  const addons = result.data;
  const count = addons.length;
  const activeCount = addons.filter((t) => t.is_active).length;
  const inactiveCount = count - activeCount;

  const stats = [
    {
      label: 'Total Add Ons',
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
          <AddonProductTable addons={addons} />
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
