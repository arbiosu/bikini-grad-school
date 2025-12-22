'use client';

import dynamic from 'next/dynamic';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InterviewFormData {
  intervieweeBio: string | null;
  intervieweeName: string;
  profile_image: string | null;
  transcript: string;
}

interface InterviewFormProps {
  data: InterviewFormData;
  onChange: (field: string, value: any) => void;
  isLoading: boolean;
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export function InterviewForm({
  data,
  onChange,
  isLoading,
}: InterviewFormProps) {
  return (
    <>
      <div>
        <Label htmlFor='intervieweeName'>Interviewee Name*</Label>
        <Input
          id='intervieweeName'
          type='text'
          value={data.intervieweeName || ''}
          onChange={(e) => onChange('intervieweeName', e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div>
        <Label htmlFor='intervieweeBio'>Interviewee Bio</Label>
        <Input
          id='intervieweeBio'
          type='text'
          value={data.intervieweeBio || ''}
          onChange={(e) => onChange('intervieweeBio', e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor='transcript'>Transcript*</Label>
        <MDEditor
          id='transcript'
          value={data.transcript || ''}
          onChange={(value = '') => onChange('transcript', value)}
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
