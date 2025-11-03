'use client';

import { Tables } from '@/lib/supabase/database/types';

import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface IssueSelectorProps {
  onChange: (issueId: number) => void;
  value: number;
  data: Tables<'issues'>[];
  disabled?: boolean;
}

export function IssueSelector({
  onChange,
  value,
  data,
  disabled,
}: IssueSelectorProps) {
  return (
    <>
      <div>
        <Label htmlFor='issueId'>Issue*</Label>
        <Select
          value={value.toString()}
          onValueChange={(value) => onChange(parseInt(value))}
          disabled={disabled}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select an Issue' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Issues</SelectLabel>
              {data.map((issue) => (
                <SelectItem value={issue.id.toString()} key={issue.id}>
                  {issue.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
