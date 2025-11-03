import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InterviewFormProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
  isLoading: boolean;
}

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
        <Input
          id='transcript'
          type='text'
          value={data.transcript || ''}
          onChange={(e) => onChange('transcript', e.target.value)}
          disabled={isLoading}
        />
      </div>
    </>
  );
}
