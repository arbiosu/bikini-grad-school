import { IssueForm } from '@/components/admin/forms/issues';
import BackButton from '@/components/admin/back-button';

export default function Page() {
  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/content' label='Back' />
      </div>
      <IssueForm />
    </section>
  );
}
