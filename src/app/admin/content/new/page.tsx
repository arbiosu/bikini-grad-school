import { queryIssues } from '@/lib/supabase/model/issues';

import { ContentForm } from '@/components/admin/forms/contents/contents';
import { redirect } from 'next/navigation';
import { queryContributor } from '@/lib/supabase/model/contributors';
import { queryRoles } from '@/lib/supabase/model/roles';

import BackButton from '@/components/admin/back-button';

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
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/content/' label='Back' />
      </div>
      <ContentForm
        mode='create'
        issues={issueData}
        availableContributors={contributorData}
        creativeRoles={creativeRoleData}
      />
    </section>
  );
}
