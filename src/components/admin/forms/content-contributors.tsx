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

interface ContentContributor {
  contributorId: number;
  roleId: number;
}

interface ContentContributorsFormProps {
  contributors: ContentContributor[];
  onChange: (contributors: ContentContributor[]) => void;
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
    onChange([...contributors, { contributorId: 0, roleId: 0 }]);
  };

  const removeContributor = (index: number) => {
    onChange(contributors.filter((_, i) => i !== index));
  };

  const updateContributor = (
    index: number,
    field: 'contributorId' | 'roleId',
    value: number
  ) => {
    const updated = [...contributors];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <>
      <div>
        <Label>Contributors</Label>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={addContributor}
          disabled={isLoading}
        >
          + Add Contributor
        </Button>
      </div>
      {contributors.length === 0 && (
        <p className='text-sm text-gray-500'>
          No contributors added yet. Click "Add Contributor" to add one.
        </p>
      )}
      <div>
        {contributors.map((contributor, index) => (
          <div
            key={`${index}-${contributor.contributorId}-${contributor.roleId}`}
            className='flex items-end gap-2 rounded-lg border p-3'
          >
            <div className='flex-1'>
              <Label htmlFor={`contributor-${index}`}>Person</Label>
              <Select
                value={
                  contributor.contributorId === 0
                    ? undefined
                    : contributor.contributorId.toString()
                }
                onValueChange={(val) =>
                  updateContributor(index, 'contributorId', parseInt(val))
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
                  contributor.roleId === 0
                    ? undefined
                    : contributor.roleId.toString()
                }
                onValueChange={(val) =>
                  updateContributor(index, 'roleId', parseInt(val))
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
              className='flex-shrink-0'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
