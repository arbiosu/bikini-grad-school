import { CreateTagForm } from '@/components/admin/forms/tags';
import BackButton from '@/components/admin/back-button';

export default function Page() {
  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/content' label='Back' />
      </div>
      <CreateTagForm />
    </section>
  );
}
