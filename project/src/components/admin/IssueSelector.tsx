'use client';

import { type Tables } from '@/lib/supabase/database';
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
  handleChange: (e: string) => void;
  data: Tables<'issues'>[];
}

export default function IssueSelector({
  handleChange,
  data,
}: IssueSelectorProps) {
  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select an issue' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Issues</SelectLabel>
          {data.map((issue) => (
            <SelectItem value={issue.id.toString()} key={issue.created_at}>
              {issue.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
