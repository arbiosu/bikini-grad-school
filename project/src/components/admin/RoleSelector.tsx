'use client';

import { type Role } from '@/lib/supabase/model/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoleSelectorProps {
  handleChange: (e: string) => void;
  data: Role[];
}

export default function RoleSelector({
  handleChange,
  data,
}: RoleSelectorProps) {
  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select a Role' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Contributors</SelectLabel>
          {data.map((contributor) => (
            <SelectItem value={contributor.id.toString()} key={contributor.id}>
              {contributor.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
