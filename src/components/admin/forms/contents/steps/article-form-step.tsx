'use client';

import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import type { ArticleData } from '@/domain/content/types';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface ArticleFormStepProps {
  data: Partial<ArticleData>;
  onChange: (data: Partial<ArticleData>) => void;
  disabled?: boolean;
}

export function ArticleFormStep({
  data,
  onChange,
  disabled,
}: ArticleFormStepProps) {
  return (
    <>
      <div>
        <Label htmlFor='body'>Article Body*</Label>
        <MDEditor
          id='body'
          data-color-mode='light'
          value={data.body || ''}
          onChange={(value = '') => onChange({ ...data, body: value })}
          height={500}
          preview='edit'
        />
      </div>
    </>
  );
}
