import { AddonProductForm } from '@/components/admin/forms/subscriptions/addons';
import BackButton from '@/components/back-button';

export default function Page() {
  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/subscriptions/addons' label='Back' />
      </div>
      <AddonProductForm mode='create' />
    </section>
  );
}
