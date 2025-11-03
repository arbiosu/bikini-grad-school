import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ArticleFormProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
  isLoading: boolean;
}

export function ArticleForm({ data, onChange, isLoading }: ArticleFormProps) {
  return (
    <>
      <div>
        <Label htmlFor='body'>Body*</Label>
        <Input
          id='body'
          type='text'
          value={data.body || ''}
          onChange={(e) => onChange('body', e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
    </>
  );
}
