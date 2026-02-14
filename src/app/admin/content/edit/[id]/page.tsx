import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/clients/service';
import {
  createIssueService,
  createContributorService,
  createRoleService,
  createTagService,
  createContentService,
} from '@/lib/container';

import { ContentForm } from '@/components/admin/forms/contents/contents';
import BackButton from '@/components/back-button';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;
  const supabase = await createServiceClient();
  const services = {
    issue: createIssueService(supabase),
    contributor: createContributorService(supabase),
    roles: createRoleService(supabase),
    tags: createTagService(supabase),
    content: createContentService(supabase),
  };

  const [content, issues, contributors, roles, tags] = await Promise.all([
    services.content.getContentById(id),
    services.issue.getAllIssues(),
    services.contributor.getAllContributors(),
    services.roles.getAllRoles(),
    services.tags.getAllTags(),
  ]);

  if (
    !content.success ||
    !issues.success ||
    !contributors.success ||
    !roles.success ||
    !tags.success
  ) {
    redirect('/admin/error');
  }

  const currentContentContributors = [];
  if (!content.data.content_contributors) {
  } else {
    for (const contributor of content.data.content_contributors) {
      currentContentContributors.push({
        contributor_id: contributor.contributor_id,
        role_id: contributor.role_id,
      });
    }
  }
  const currentContentTags = [];
  if (!content.data.content_tags) {
    console.log('content tags is empty, not returning values');
  } else {
    for (const tag of content.data.content_tags) {
      currentContentTags.push({
        tag_id: tag.tag_id,
      });
    }
  }
  console.log('content tags', currentContentTags);

  return (
    <section>
      <div className='mx-auto max-w-7xl px-4 pb-4'>
        <BackButton href='/admin/content' label='Back' />
      </div>
      <ContentForm
        mode='edit'
        issues={issues.data}
        availableContributors={contributors.data}
        availableTags={tags.data}
        creativeRoles={roles.data}
        editData={{
          content: {
            id: content.data.id,
            title: content.data.title,
            slug: content.data.slug,
            issue_id: content.data.issue_id,
            published: content.data.published,
            published_at: content.data.published_at,
            summary: content.data.summary,
            type: content.data.type,
            cover_image_url: content.data.cover_image_url,
            created_at: content.data.created_at,
            updated_at: content.data.updated_at,
          },
          article: content.data.articles ? content.data.articles : undefined,
          feature: content.data.features ? content.data.features : undefined,
          interview: content.data.interviews
            ? content.data.interviews
            : undefined,
          contributors: currentContentContributors,
          tags: currentContentTags,
        }}
      />
    </section>
  );
}
