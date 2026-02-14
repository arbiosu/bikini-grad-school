import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createContentService } from '@/lib/container';
import { redirect } from 'next/navigation';

import { AdminHeader } from '@/components/admin/admin-header';
import { Stats } from '@/components/admin/stats';
import { ContentTable } from '@/components/admin/content-table';
import {
  FileText,
  CheckCircle2,
  PenLine,
  Newspaper,
  Mic,
  Star,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Content Management - BGS Admin',
  description:
    'Manage articles, stories, and editorial pieces across all BGS issues.',
};

export default async function ContentPage() {
  const supabase = await createServiceClient();
  const service = createContentService(supabase);

  const result = await service.listAllContent();

  if (!result.success) {
    redirect('/admin/error');
  }

  const content = result.data.data;
  const totalCount = result.data.count || 0;

  const articleCount = content.filter((c) => c.type === 'article');
  const featureCount = content.filter((c) => c.type === 'feature');
  const interviewCount = content.filter((c) => c.type === 'interview');
  const publishedCount = content.filter((c) => c.published);

  const stats = [
    {
      label: 'Total Content',
      value: totalCount,
      icon: FileText,
    },
    {
      label: 'Published',
      value: publishedCount.length,
      icon: CheckCircle2,
    },
    {
      label: 'Unpublished',
      value: totalCount - publishedCount.length,
      icon: PenLine,
    },
    {
      label: 'Articles',
      value: articleCount.length,
      icon: Newspaper,
    },
    {
      label: 'Features',
      value: featureCount.length,
      icon: Star,
    },
    {
      label: 'Interviews',
      value: interviewCount.length,
      icon: Mic,
    },
  ];

  return (
    <div className='bg-background min-h-screen'>
      <AdminHeader breadcrumbs={[{ label: 'Content' }]} />
      <main className='mx-auto max-w-7xl px-6 py-8 lg:px-8'>
        <div className='mb-8'>
          <h2 className='text-foreground text-2xl font-semibold tracking-tight text-balance'>
            Content Management
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Create, edit, and organize articles and editorial pieces across all
            BGS issues.
          </p>
        </div>

        <Stats stats={stats} />

        <div className='mt-8'>
          <ContentTable content={content} />
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
