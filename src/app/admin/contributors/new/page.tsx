import { ContributorForm } from '@/components/admin/forms/contributors/contributors';
import BackButton from '@/components/back-button';

export default function Page() {
  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/contributors' label='Back' />
      </div>
      <ContributorForm mode='create' />
    </section>
  );
}
