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

interface ContentTagsFormProps {
  tags: Array<{ tag_id: number }>;
  onChange: (tags: Array<{ tag_id: number }>) => void;
  availableTags: Array<{ id: number; name: string }>;
  isLoading?: boolean;
}

export function ContentTagsForm(props: ContentTagsFormProps) {
  const { tags, onChange, availableTags, isLoading } = props;

  const addTag = () => {
    onChange([...tags, { tag_id: 0 }]);
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const updateTag = (index: number, field: 'tag_id', value: number) => {
    const updated = [...tags];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <>
      <div>
        <Label>Tags</Label>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={addTag}
          disabled={isLoading}
          className='ml-2'
        >
          + Add Tag
        </Button>
      </div>
      {tags.length === 0 && (
        <p className='text-sm text-gray-500'>
          No tags added yet. Click "Add Tag" to add one.
        </p>
      )}
      <div className='space-y-2'>
        {tags.map((tag, index) => (
          <div
            key={`${index}-${tag.tag_id}`}
            className='flex items-end gap-2 rounded-lg border p-3'
          >
            <div className='flex-1'>
              <Label htmlFor={`tag-${index}`}>Tag</Label>
              <Select
                value={tag.tag_id === 0 ? undefined : tag.tag_id.toString()}
                onValueChange={(val) =>
                  updateTag(index, 'tag_id', parseInt(val))
                }
                disabled={isLoading}
              >
                <SelectTrigger id={`tag-${index}`}>
                  <SelectValue placeholder='Select tag...' />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => removeTag(index)}
              disabled={isLoading}
              className='shrink-0'
              aria-label='Remove tag'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
