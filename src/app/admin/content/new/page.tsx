import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/clients/service';
import {
  createIssueService,
  createContributorService,
  createRoleService,
  createTagService,
} from '@/lib/container';

import { ContentForm } from '@/components/admin/forms/contents/contents';
import BackButton from '@/components/back-button';

export default async function Page() {
  const supabase = await createServiceClient();
  const services = {
    issue: createIssueService(supabase),
    contributor: createContributorService(supabase),
    roles: createRoleService(supabase),
    tags: createTagService(supabase),
  };

  const [issues, contributors, roles, tags] = await Promise.all([
    services.issue.getAllIssues(),
    services.contributor.getAllContributors(),
    services.roles.getAllRoles(),
    services.tags.getAllTags(),
  ]);

  if (
    !issues.success ||
    !contributors.success ||
    !roles.success ||
    !tags.success
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
        issues={issues.data}
        availableContributors={contributors.data}
        creativeRoles={roles.data}
        availableTags={tags.data}
      />
    </section>
  );
}
