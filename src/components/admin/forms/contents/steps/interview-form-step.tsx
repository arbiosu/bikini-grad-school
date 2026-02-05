'use client';

import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { InterviewData } from '@/lib/content/domain/handlers';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface InterviewFormStepProps {
  data: Partial<InterviewData>;
  onChange: (data: Partial<InterviewData>) => void;
  disabled?: boolean;
}

export function InterviewFormStep({
  data,
  onChange,
  disabled,
}: InterviewFormStepProps) {
  return (
    <>
      <div>
        <Label htmlFor='interviewee_name'>Interviewee Name*</Label>
        <Input
          id='interviewee_name'
          type='text'
          value={data.interviewee_name || ''}
          onChange={(e) =>
            onChange({ ...data, interviewee_name: e.target.value })
          }
          disabled={disabled}
          required
          placeholder='Full name of the interviewee'
        />
      </div>
      <div>
        <Label htmlFor='interviewee_bio'>Interviewee Bio</Label>
        <Input
          id='interviewee_bio'
          type='text'
          value={data.interviewee_bio || ''}
          onChange={(e) =>
            onChange({ ...data, interviewee_bio: e.target.value })
          }
          disabled={disabled}
          placeholder='Brief biography'
        />
      </div>
      <div>
        <Label htmlFor='profile_image'>Profile Image URL</Label>
        <Input
          id='profile_image'
          type='url'
          value={data.profile_image || ''}
          onChange={(e) => onChange({ ...data, profile_image: e.target.value })}
          disabled={disabled}
          placeholder='https://example.com/profile.jpg'
        />
      </div>
      <div>
        <Label htmlFor='transcript'>Interview Transcript*</Label>
        <MDEditor
          id='transcript'
          data-color-mode='light'
          value={data.transcript || ''}
          onChange={(value = '') => onChange({ ...data, transcript: value })}
          height={500}
          preview='edit'
        />
      </div>
    </>
  );
}
