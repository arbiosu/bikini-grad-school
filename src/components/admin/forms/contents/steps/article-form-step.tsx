'use client';

import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { ArticleData } from '@/lib/content/domain/handlers';

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
      <div>
        <Label htmlFor='featured_image'>Featured Image URL</Label>
        <Input
          id='featured_image'
          type='url'
          value={data.featured_image || ''}
          onChange={(e) =>
            onChange({ ...data, featured_image: e.target.value })
          }
          disabled={disabled}
          placeholder='https://example.com/image.jpg'
        />
      </div>
    </>
  );
}
