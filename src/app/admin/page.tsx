import {
  BookOpen,
  FileText,
  Users,
  Palette,
  Tag,
  ImageIcon,
  Mail,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminNavCard } from '@/components/admin/admin-nav-card';
import { AdminStats } from '@/components/admin/admin-stats';
import { Stats } from '@/components/admin/stats';

import { createServiceClient } from '@/lib/supabase/clients/service';
import {
  createContentService,
  createIssueService,
  createContributorService,
} from '@/lib/container';
import { redirect } from 'next/navigation';

const navItems = [
  {
    title: 'Issues',
    description:
      'Create, edit, and manage magazine issues. Control publication dates and featured content.',
    href: '/admin/issues',
    icon: BookOpen,
  },
  {
    title: 'Content',
    description:
      'Manage articles, features, and interviews. Organize content across issues.',
    href: '/admin/content',
    icon: FileText,
  },
  {
    title: 'Contributors',
    description: 'Create, edit, and manage contributor profiles, bios.',
    href: '/admin/contributors',
    icon: Users,
  },
  {
    title: 'Creative Roles',
    description:
      'Define and assign creative roles such as editor, writer, photographer, and designer.',
    href: '/admin/roles',
    icon: Palette,
  },
  {
    title: 'Tags',
    description: 'Organize content with tags and categories.',
    href: '/admin/tags',
    icon: Tag,
  },
  {
    title: 'Images',
    description:
      'Upload, organize, and manage the media library. Handle image assets and galleries.',
    href: '/admin/images',
    icon: ImageIcon,
  },
  {
    title: 'Email',
    description: 'Compose newsletters, manage subscriber lists.',
    href: '/admin/email',
    icon: Mail,
  },
  {
    title: 'Products',
    description: 'Create, edit and manage BGS products.',
    href: '/admin/products',
    icon: Mail,
  },
];

export default async function Page() {
  const supabase = await createServiceClient();
  const services = {
    content: createContentService(supabase),
    issue: createIssueService(supabase),
    contributors: createContributorService(supabase),
  };

  const [content, issues, contributors] = await Promise.all([
    services.content.listContentStats(),
    services.issue.getCount(),
    services.contributors.getCount(),
  ]);

  if (!content.success || !issues.success || !contributors.success) {
    redirect('/admin/error');
  }

  const stats = [
    { label: 'Issues', value: issues.data, icon: FileText },
    { label: 'Content', value: content.data[0], icon: FileText },
    { label: 'Contributors', value: contributors.data, icon: Users },
    { label: 'Tags', value: 3, icon: Tag },
    { label: 'Images', value: 50, icon: ImageIcon },
  ];

  return (
    <div className='bg-background min-h-screen'>
      <AdminHeader />
      <main className='mx-auto max-w-7xl px-6 py-8 lg:px-8'>
        <div className='mb-8'>
          <h2 className='text-foreground text-2xl font-semibold tracking-tight text-balance'>
            Admin Portal
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Manage all BGS content from one place. Select a section below to get
            started.
          </p>
        </div>

        <Stats stats={stats} />

        <div className='mt-8'>
          <h3 className='text-muted-foreground mb-4 text-xs font-medium tracking-wider uppercase'>
            Management
          </h3>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {navItems.map((item) => (
              <AdminNavCard
                key={item.title}
                title={item.title}
                description={item.description}
                href={item.href}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
