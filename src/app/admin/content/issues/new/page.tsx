import { CreateIssueForm } from '@/components/admin/forms/issues';

export default function Page() {
  return (
    <section>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl'>
          Admin Portal - Content - Manage Issues - New
        </h1>
      </div>
      <div className='flex justify-center'>
        <CreateIssueForm />
      </div>
    </section>
  );
}
