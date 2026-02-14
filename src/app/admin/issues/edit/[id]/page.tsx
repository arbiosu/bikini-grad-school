import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createIssueService } from '@/lib/container';

import BackButton from '@/components/back-button';
import { IssueForm } from '@/components/admin/forms/issues/issues';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;

  const supabase = await createServiceClient();
  const service = createIssueService(supabase);

  const result = await service.getIssueById(id);

  if (!result.success) {
    redirect('/admin/error');
  }

  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/issues/' label='Back' />
      </div>
      <IssueForm mode={'edit'} editData={{ issue: result.data }} />
    </section>
  );
}
