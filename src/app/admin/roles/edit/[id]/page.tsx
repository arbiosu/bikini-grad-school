import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createRoleService } from '@/lib/container';

import BackButton from '@/components/back-button';
import { CreativeRoleForm } from '@/components/admin/forms/creative-roles/creative-roles';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;

  const supabase = await createServiceClient();
  const service = createRoleService(supabase);

  const result = await service.getRoleById(id);

  if (!result.success) {
    redirect('/admin/error');
  }

  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/roles/' label='Back' />
      </div>
      <CreativeRoleForm mode='edit' editData={{ creativeRole: result.data }} />
    </section>
  );
}
