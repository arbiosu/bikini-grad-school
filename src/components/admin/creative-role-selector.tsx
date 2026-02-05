'use client';

import { Tables } from '@/lib/supabase/database/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreativeRoleSelectorProps {
  handleChange: (e: string) => void;
  value: string;
  data: Tables<'creative_roles'>[];
}

export default function CreativeRoleSelector({
  handleChange,
  value,
  data,
}: CreativeRoleSelectorProps) {
  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className='w-45'>
        <SelectValue placeholder='Select a creative role...' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Creative Role</SelectLabel>
          {data.map((role) => (
            <SelectItem value={role.id.toString()} key={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
