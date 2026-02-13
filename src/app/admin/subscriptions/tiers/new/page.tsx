import { TierForm } from '@/components/admin/forms/subscriptions/tiers/tiers';
import BackButton from '@/components/back-button';

export default function Page() {
  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/subscriptions/tiers' label='Back' />
      </div>
      <TierForm mode='create' />
    </section>
  );
}
