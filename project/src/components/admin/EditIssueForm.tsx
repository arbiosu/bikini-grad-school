'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { editIssue } from '@/lib/supabase/model';
import { type Tables } from '@/lib/supabase/database';

interface IssueProps {
  issue: Tables<'issues'>;
}

export default function EditIssueForm({ issue }: IssueProps) {
  const [title, setTitle] = useState<string>(issue.title);
  const [description, setDescription] = useState<string>(issue.description);
  const [isPublished, setIsPublished] = useState<boolean>(issue.is_published);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handlePublishedChange = (value: string) => {
    setIsPublished(value === 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const editedIssue = await editIssue({
        title: title,
        description: description,
        is_published: isPublished,
        id: issue.id,
      });
      if (editedIssue) {
        setSuccess('Issue created successfully!');
      }
    } catch (error) {
      console.log(error);
      setError('Could not create issue. Contact an admin.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='mx-auto max-w-6xl p-2'>
      <div className='flex flex-col gap-24 md:flex-row'>
        <div className='flex-1'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='title' className='text-xl'>
                title of the issue
              </Label>
              <Input
                type='text'
                name='title'
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor='description' className='text-xl'>
                Description of the issue, optional.
              </Label>
              <Input
                type='text'
                name='subtitle'
                defaultValue=''
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor='is_published' className='text-xl'>
                Set whether the article should be immediately published or not.
              </Label>
              <Select
                onValueChange={handlePublishedChange}
                value={isPublished ? 'true' : 'false'}
                disabled={isLoading}
                name='is_published'
              >
                <SelectTrigger id='is_published'>
                  <SelectValue placeholder='Select status...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='true'>Published</SelectItem>
                  <SelectItem value='false'>Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className='mt-2 text-blue-600'>
              Contact an admin if you need to change the following:{' '}
            </p>
            <p className='mx-1 mt-2 text-blue-600'>
              {issue.publication_date ? (
                <span>
                  Publication Date:{' '}
                  {new Date(issue.publication_date).toLocaleDateString()}
                </span>
              ) : (
                <span>No publication date set.</span>
              )}
            </p>
            <p className='mx-1 mt-2 text-blue-600'>
              Cover Image: {issue.cover_image_path}
            </p>
            {error && <p className='mt-2 text-red-600'>{error}</p>}
            {success && <p className='mt-2 text-green-600'>{success}</p>}
            <Button type='submit' size='lg' disabled={isLoading}>
              {isLoading ? 'processing...' : 'submit'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
