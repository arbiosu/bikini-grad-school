import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAllSubscriptions } from '@/actions/subscriptions/subscriptions';

import { AdminHeader } from '@/components/admin/admin-header';
import { SubscriptionTable } from '@/components/admin/subscriptions-table';
import { Stats } from '@/components/admin/stats';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Subscription Management - BGS Admin',
  description: 'Manage all BGS subscriptions.',
};

export default async function IssuePage() {
  const result = await getAllSubscriptions();

  if (!result.success) {
    redirect('/admin/error');
  }

  const subs = result.data;
  const count = subs.length;

  const stats = [
    {
      label: 'Total Subscriptions',
      value: count,
      icon: FileText,
    },
  ];

  return (
    <div className='bg-background min-h-screen'>
      <AdminHeader breadcrumbs={[{ label: 'Content' }]} />
      <main className='mx-auto max-w-7xl px-6 py-8 lg:px-8'>
        <div className='mb-8'>
          <h2 className='text-foreground text-2xl font-semibold tracking-tight text-balance'>
            Subscription Management
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Create, edit, and organize subscriptions.
          </p>
        </div>

        <Stats stats={stats} />

        <div className='mt-8'>
          <SubscriptionTable subs={subs} />
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
