import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/clients/service';
import { createAddonProductService } from '@/lib/container';

import BackButton from '@/components/back-button';
import { AddonProductForm } from '@/components/admin/forms/subscriptions/addons';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const supabase = await createServiceClient();
  const service = createAddonProductService(supabase);

  const result = await service.getById(id);

  if (!result.success) {
    redirect('/admin/error');
  }
  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/subscriptions/addons' label='Back' />
      </div>
      <AddonProductForm mode={'edit'} editData={result.data} />
    </section>
  );
}
