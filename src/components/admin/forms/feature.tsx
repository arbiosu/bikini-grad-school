import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FeatureFormData {
  description: string;
}

interface FeatureFormProps {
  data: FeatureFormData;
  onChange: (field: string, value: any) => void;
  isLoading: boolean;
}

export function FeatureForm({ data, onChange, isLoading }: FeatureFormProps) {
  return (
    <>
      <div>
        <Label htmlFor='description'>Description*</Label>
        <Input
          id='description'
          type='text'
          value={data.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
    </>
  );
}
