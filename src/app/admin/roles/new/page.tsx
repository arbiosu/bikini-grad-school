import { CreativeRoleForm } from '@/components/admin/forms/creative-roles/creative-roles';
import BackButton from '@/components/back-button';

export default function Page() {
  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/roles' label='Back' />
      </div>
      <CreativeRoleForm mode='create' />
    </section>
  );
}
