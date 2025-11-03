import { queryIssues } from '@/lib/supabase/model/issues';

import { CreateContentForm } from '@/components/admin/forms/content';
import { redirect } from 'next/navigation';
import { queryContributor } from '@/lib/supabase/model/contributors';
import { queryRoles } from '@/lib/supabase/model/roles';

export default async function Page() {
  const { data: issueData, error } = await queryIssues();

  const { data: contributorData, error: contributorError } =
    await queryContributor();

  const { data: creativeRoleData, error: creativeRoleError } =
    await queryRoles();

  if (
    error ||
    contributorError ||
    creativeRoleError ||
    !issueData ||
    !contributorData ||
    !creativeRoleData
  ) {
    redirect('/admin/error');
  }
  return (
    <section>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl'>Admin Portal - Content - New</h1>
      </div>
      <div className='flex justify-center'>
        <CreateContentForm
          issues={issueData}
          availableContributors={contributorData}
          availableRoles={creativeRoleData}
        />
      </div>
    </section>
  );
}
