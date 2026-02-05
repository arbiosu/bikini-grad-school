'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { FeatureData } from '@/lib/content/domain/handlers';

interface FeatureFormStepProps {
  data: Partial<FeatureData>;
  onChange: (data: Partial<FeatureData>) => void;
  disabled?: boolean;
}

export function FeatureFormStep({
  data,
  onChange,
  disabled,
}: FeatureFormStepProps) {
  return (
    <div>
      <Label htmlFor='description'>Feature Description*</Label>
      <Input
        id='description'
        type='text'
        value={data.description || ''}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
        disabled={disabled}
        required
        placeholder='Brief description of the feature'
      />
    </div>
  );
}
