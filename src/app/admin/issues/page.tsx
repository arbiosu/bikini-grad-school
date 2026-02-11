import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createIssueService } from '@/lib/container';
import { redirect } from 'next/navigation';

import { AdminHeader } from '@/components/admin/admin-header';
import { IssueTable } from '@/components/admin/issue-table';
import { Stats } from '@/components/admin/stats';
import { FileText, CheckCircle2, PenLine } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Issue Management - BGS Admin',
  description: 'Manage all BGS issues.',
};

export default async function IssuePage() {
  const supabase = await createServiceClient();
  const service = createIssueService(supabase);

  const result = await service.getAllIssues();

  if (!result.success) {
    redirect('/admin/error');
  }

  const issues = result.data;
  const count = issues.length;
  const publishedCount = issues.filter((i) => i.published).length;
  const unpublishedCount = count - publishedCount;

  const stats = [
    {
      label: 'Total Issues',
      value: count,
      icon: FileText,
    },
    {
      label: 'Published',
      value: publishedCount,
      icon: CheckCircle2,
    },
    {
      label: 'Unpublished',
      value: unpublishedCount,
      icon: PenLine,
    },
  ];

  return (
    <div className='bg-background min-h-screen'>
      <AdminHeader breadcrumbs={[{ label: 'Content' }]} />
      <main className='mx-auto max-w-7xl px-6 py-8 lg:px-8'>
        <div className='mb-8'>
          <h2 className='text-foreground text-2xl font-semibold tracking-tight text-balance'>
            Issue Management
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Create, edit, and organize issues.
          </p>
        </div>

        <Stats stats={stats} />

        <div className='mt-8'>
          <IssueTable issues={issues} />
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
