import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createContributorService } from '@/lib/container';

import BackButton from '@/components/back-button';
import { ContributorForm } from '@/components/admin/forms/contributors/contributors';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;

  const supabase = await createServiceClient();
  const service = createContributorService(supabase);

  const result = await service.getContributorById(id);

  if (!result.success) {
    redirect('/admin/error');
  }

  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/contributors/' label='Back' />
      </div>
      <ContributorForm mode='edit' editData={{ contributor: result.data }} />
    </section>
  );
}
