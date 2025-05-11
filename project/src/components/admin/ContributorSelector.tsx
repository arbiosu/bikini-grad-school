'use client';

import { type Contributor } from '@/lib/supabase/model/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContributorSelectorProps {
  handleChange: (e: string) => void;
  value: string;
  data: Contributor[];
}

export default function ContributorSelector({
  handleChange,
  value,
  data,
}: ContributorSelectorProps) {
  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select a contributor' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Contributors</SelectLabel>
          {data.map((contributor) => (
            <SelectItem value={contributor.id} key={contributor.id}>
              {contributor.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
