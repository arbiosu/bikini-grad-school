'use client';

import { useState, useRef } from 'react';
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
import { createIssue } from '@/lib/supabase/model';

export default function CreateNewIssueForm() {
  const [title, setTitle] = useState<string>(
    'Enter the title of the issue here, cAsE sEnSiTiVe!'
  );
  const [description, setDescription] = useState<string>('');
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePublishedChange = (value: string) => {
    setIsPublished(value === 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!file) {
      setError('Please upload an image');
      return;
    }

    try {
      const newIssue = await createIssue(
        {
          title: title,
          description: description,
          is_published: isPublished,
        },
        file
      );
      if (newIssue) {
        setSuccess('Issue created successfully!');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setError('');
        setTitle('Create another issue, or exit out.');
        setDescription('');
        setIsPublished(false);
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
      <h3 className='mb-6 text-lg'>
        Title and whether this issue will be immediately published and the image
        are required.
      </h3>
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
            <div>
              <Label className='mb-2 block text-lg font-bold text-black'>
                Image upload* - keep filenames unique (Recommended naming
                scheme: issue-ISSUE_NUMBER)
              </Label>
              <Input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                ref={fileInputRef}
                className='w-full rounded border p-2 text-black'
                required
              />
            </div>
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
