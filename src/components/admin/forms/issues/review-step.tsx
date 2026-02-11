'use client';

import type { IssueData } from '@/lib/issues/domain/types';

interface ReviewStepProps {
  formData: IssueData;
}

export function ReviewStep({ formData }: ReviewStepProps) {
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
              <dt className='w-32 font-medium text-gray-500'>Issue Number:</dt>
              <dd className='text-gray-900'>{formData.issue_number}</dd>
            </div>
            <div className='flex'>
              <dt className='w-32 font-medium text-gray-500'>Publish Date:</dt>
              <dd className='text-gray-900'>{formData.publication_date}</dd>
            </div>
            <div className='flex'>
              <dt className='w-32 font-medium text-gray-500'>Is Published:</dt>
              <dd className='text-gray-900'>
                {formData.published ? 'Live' : 'Draft'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
