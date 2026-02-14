import { IssueForm } from '@/components/admin/forms/issues/issues';
import BackButton from '@/components/back-button';

export default function Page() {
  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/issues/' label='Back' />
      </div>
      <IssueForm mode='create' />
    </section>
  );
}
