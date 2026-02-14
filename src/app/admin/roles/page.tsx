import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createRoleService } from '@/lib/container';
import { redirect } from 'next/navigation';

import { AdminHeader } from '@/components/admin/admin-header';
import { Stats } from '@/components/admin/stats';
import { RoleTable } from '@/components/admin/roles-table';

import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Role Management - BGS Admin',
  description: 'Manage creative roles.',
};

export default async function RolePage() {
  const supabase = await createServiceClient();
  const service = createRoleService(supabase);

  const result = await service.getAllRoles();

  if (!result.success) {
    redirect('/admin/error');
  }

  const roles = result.data;
  const totalCount = roles.length;

  const stats = [
    {
      label: 'Total Creative Roles',
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
            Creative Role Management
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Create, edit, and organize creative roles across all BGS content.
          </p>
        </div>

        <Stats stats={stats} />

        <div className='mt-8'>
          <RoleTable roles={roles} />
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
