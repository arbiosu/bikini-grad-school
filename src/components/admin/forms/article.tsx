'use client';

import dynamic from 'next/dynamic';

import { Label } from '@/components/ui/label';

interface ArticleFormData {
  body: string;
  featuredImage: string | null;
}

interface ArticleFormProps {
  data: ArticleFormData;
  onChange: (field: string, value: any) => void;
  isLoading: boolean;
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export function ArticleForm({ data, onChange, isLoading }: ArticleFormProps) {
  return (
    <>
      <div>
        <Label htmlFor='body'>Body*</Label>
        <MDEditor
          id='body'
          value={data.body || ''}
          onChange={(value = '') => onChange('body', value)}
          height={500}
          preview='edit'
          textareaProps={{
            name: 'body',
            id: 'body',
            required: true,
          }}
        />
      </div>
    </>
  );
}
