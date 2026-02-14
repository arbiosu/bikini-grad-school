'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import type { FormContributor } from '@/lib/common/form-types';

interface ContentContributorsFormProps {
  contributors: FormContributor[];
  onChange: (contributors: FormContributor[]) => void;
  availableContributors: { id: number; name: string }[];
  availableRoles: { id: number; name: string }[];
  isLoading?: boolean;
}

export function ContentContributorsForm({
  contributors,
  onChange,
  availableContributors,
  availableRoles,
  isLoading,
}: ContentContributorsFormProps) {
  const addContributor = () => {
    onChange([...contributors, { contributor_id: 0, role_id: 0 }]);
  };

  const removeContributor = (index: number) => {
    onChange(contributors.filter((_, i) => i !== index));
  };

  const updateContributor = (
    index: number,
    field: 'contributor_id' | 'role_id',
    value: number
  ) => {
    const updated = [...contributors];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <>
      <div>
        <Label>Contributors*</Label>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={addContributor}
          disabled={isLoading}
          className='ml-2'
        >
          + Add Contributor
        </Button>
      </div>
      {contributors.length === 0 && (
        <p className='text-sm text-gray-500'>
          No contributors added yet. Click "Add Contributor" to add one.
        </p>
      )}
      <div className='space-y-2'>
        {contributors.map((contributor, index) => (
          <div
            key={`${index}-${contributor.contributor_id}-${contributor.role_id}`}
            className='flex items-end gap-2 rounded-lg border p-3'
          >
            <div className='flex-1'>
              <Label htmlFor={`contributor-${index}`}>Person</Label>
              <Select
                value={
                  contributor.contributor_id === 0
                    ? undefined
                    : contributor.contributor_id.toString()
                }
                onValueChange={(val) =>
                  updateContributor(index, 'contributor_id', parseInt(val))
                }
                disabled={isLoading}
              >
                <SelectTrigger id={`contributor-${index}`}>
                  <SelectValue placeholder='Select contributor...' />
                </SelectTrigger>
                <SelectContent>
                  {availableContributors.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex-1'>
              <Label htmlFor={`role-${index}`}>Role</Label>
              <Select
                value={
                  contributor.role_id === 0
                    ? undefined
                    : contributor.role_id.toString()
                }
                onValueChange={
                  (val) => updateContributor(index, 'role_id', parseInt(val)) // ← Fixed
                }
                disabled={isLoading}
              >
                <SelectTrigger id={`role-${index}`}>
                  <SelectValue placeholder='Select role...' />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => removeContributor(index)}
              disabled={isLoading}
              className='shrink-0'
              aria-label='Remove contributor'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
