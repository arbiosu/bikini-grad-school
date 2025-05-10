import { queryPhotoshoots } from '@/lib/supabase/model/photoshoots';
import { queryContributors } from '@/lib/supabase/model/contributors';
import { fetchRoles } from '@/lib/supabase/model/roles';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditPhotoshootForm from '@/components/admin/EditPhotoshootForm';
import CreateNewPhotoshootContributorForm from '@/components/admin/CreatePhotoshootContributorForm';
import LinkButton from '@/components/admin/LinkButton';
import { ArrowLeft } from 'lucide-react';

export default async function EditPhotoshootPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const photoshootId = (await params).id;
  const { data, error } = await queryPhotoshoots({
    filter: {
      id: photoshootId,
    },
  });
  const { data: contributors, error: contributorsError } =
    await queryContributors();
  const { data: roles, error: rolesError } = await fetchRoles();
  console.log('Roles: ', roles);

  if (
    error ||
    !data ||
    contributorsError ||
    !contributors ||
    rolesError ||
    !roles
  ) {
    redirect('/admin');
  }

  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className='container mx-auto p-20'>
      <h1 className='text-3xl font-bold'>Edit Photoshoot: {data[0].title}</h1>
      <LinkButton
        href={'/admin/photoshoots'}
        label='Back to Photoshoot Dashboard'
        Icon={ArrowLeft}
      />
      <EditPhotoshootForm photoshoot={data[0]} />
      <CreateNewPhotoshootContributorForm
        photoshootId={photoshootId}
        contributors={contributors}
        roles={roles}
      />
    </div>
  );
}
