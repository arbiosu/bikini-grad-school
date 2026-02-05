'use client';

import type { ContentFormData } from '@/hooks/useContentForm';
import type { Tables } from '@/lib/supabase/database/types';

interface ReviewStepProps {
  formData: ContentFormData;
  issues: Tables<'issues'>[];
  contributors: Tables<'contributors'>[];
  roles: Tables<'creative_roles'>[];
}

export function ReviewStep({
  formData,
  issues,
  contributors,
  roles,
}: ReviewStepProps) {
  const issue = issues.find((i) => i.id === formData.issue_id);

  return (
    <div className='space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-6'>
      <div>
        <h3 className='mb-4 text-lg font-semibold'>Review Your Content</h3>
        <p className='text-sm text-gray-600'>
          Please review all information before submitting. You can go back to
          make changes.
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <h4 className='font-medium text-gray-700'>Basic Information</h4>
          <dl className='mt-2 space-y-1 text-sm'>
            <div className='flex'>
              <dt className='w-32 font-medium text-gray-500'>Title:</dt>
              <dd className='text-gray-900'>{formData.title}</dd>
            </div>
            <div className='flex'>
              <dt className='w-32 font-medium text-gray-500'>Slug:</dt>
              <dd className='text-gray-900'>{formData.slug}</dd>
            </div>
            <div className='flex'>
              <dt className='w-32 font-medium text-gray-500'>Type:</dt>
              <dd className='text-gray-900 capitalize'>{formData.type}</dd>
            </div>
            <div className='flex'>
              <dt className='w-32 font-medium text-gray-500'>Issue:</dt>
              <dd className='text-gray-900'>
                {issue?.title || 'Not selected'}
              </dd>
            </div>
            <div className='flex'>
              <dt className='w-32 font-medium text-gray-500'>Publish Date:</dt>
              <dd className='text-gray-900'>{formData.published_at}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className='font-medium text-gray-700'>Content</h4>
          <p className='mt-2 text-sm text-gray-600'>
            {formData.type === 'article' &&
              `Article body: ${formData.article?.body?.length || 0} characters`}
            {formData.type === 'feature' &&
              `Description: ${formData.feature?.description?.length || 0} characters`}
            {formData.type === 'interview' &&
              `Transcript: ${formData.interview?.transcript?.length || 0} characters`}
          </p>
        </div>

        <div>
          <h4 className='font-medium text-gray-700'>Contributors</h4>
          <ul className='mt-2 space-y-1 text-sm'>
            {formData.contributors.map((c, i) => {
              const contributor = contributors.find(
                (con) => con.id === c.contributor_id
              );
              const role = roles.find((r) => r.id === c.role_id);
              return (
                <li key={i} className='text-gray-900'>
                  {contributor?.name} - {role?.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
