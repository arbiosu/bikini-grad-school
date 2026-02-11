import { TagForm } from '@/components/admin/forms/tags/tags';
import BackButton from '@/components/back-button';

export default function Page() {
  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/tags' label='Back' />
      </div>
      <TagForm mode='create' />
    </section>
  );
}
