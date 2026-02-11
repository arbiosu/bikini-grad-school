import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createTagService } from '@/lib/container';

import BackButton from '@/components/back-button';
import { TagForm } from '@/components/admin/forms/tags/tags';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;

  const supabase = await createServiceClient();
  const service = createTagService(supabase);

  const result = await service.getTagById(id);

  if (!result.success) {
    redirect('/admin/error');
  }

  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/tags/' label='Back' />
      </div>
      <TagForm mode='edit' editData={{ tag: result.data }} />
    </section>
  );
}
