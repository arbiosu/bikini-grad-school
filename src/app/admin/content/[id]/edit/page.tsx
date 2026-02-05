import { redirect } from 'next/navigation';
import { queryContributor } from '@/lib/supabase/model/contributors';
import { queryRoles } from '@/lib/supabase/model/roles';
import { queryIssues } from '@/lib/supabase/model/issues';

import {
  contentService,
  isArticle,
  isFeature,
  isInterview,
} from '@/lib/content/services';

import { ContentForm } from '@/components/admin/forms/contents/contents';
import BackButton from '@/components/admin/back-button';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;
  const res = await contentService.getContentById(id);

  if (!res.success) {
    redirect('/admin/error');
  }

  const { data: issueData, error: issueError } = await queryIssues();
  const { data: contributorData, error: contributorError } =
    await queryContributor();
  const { data: creativeRoleData, error: creativeRoleError } =
    await queryRoles();

  if (
    issueError ||
    contributorError ||
    creativeRoleError ||
    !issueData ||
    !contributorData ||
    !creativeRoleData
  ) {
    redirect('/admin/error');
  }
  const currentContentContributors = [];
  for (const contributor of res.data.contributors) {
    currentContentContributors.push({
      contributor_id: contributor.contributor_id,
      role_id: contributor.role_id,
    });
  }

  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/content/manage' label='Back' />
      </div>
      <ContentForm
        mode='edit'
        issues={issueData}
        availableContributors={contributorData}
        creativeRoles={creativeRoleData}
        editData={{
          content: res.data.content,
          article: isArticle(res.data.content.type, res.data.typeData)
            ? res.data.typeData
            : undefined,
          feature: isFeature(res.data.content.type, res.data.typeData)
            ? res.data.typeData
            : undefined,
          interview: isInterview(res.data.content.type, res.data.typeData)
            ? res.data.typeData
            : undefined,
          contributors: currentContentContributors,
        }}
      />
    </section>
  );
}
