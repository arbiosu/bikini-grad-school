'use client';

import { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createArticle } from '@/lib/supabase/model';
import IssueSelector from './IssueSelector';
import { type Tables } from '@/lib/supabase/database';

interface IssuesProps {
  issues: Tables<'issues'>[];
}

export default function CreateNewArticleForm({ issues }: IssuesProps) {
  const titleRef = useRef('');
  const subtitleRef = useRef('');
  const authorRef = useRef('');
  const contentRef = useRef('');
  const issueIdRef = useRef('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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
      setLoading(false);
      return;
    }

    try {
      const newArticle = await createArticle(
        {
          title: titleRef.current,
          subtitle: subtitleRef.current,
          author: authorRef.current,
          content: contentRef.current,
          is_published: isPublished,
          issue_id: parseInt(issueIdRef.current),
        },
        file
      );
      if (newArticle) {
        alert('Article created successfully!');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setError('');
      }
    } catch (error) {
      console.log(error);
      alert('Could not create article. Contact an admin.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h3 className='mb-6 text-lg'>all fields required</h3>
      <div className='flex flex-col gap-24 md:flex-row'>
        <div className='flex-1'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='title' className='text-xl'>
                title of the article
              </Label>
              <Input
                type='text'
                name='title'
                defaultValue=''
                onChange={(e) => (titleRef.current = e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor='subtitle' className='text-xl'>
                subtitle of the article
              </Label>
              <Input
                type='text'
                name='subtitle'
                defaultValue=''
                onChange={(e) => (subtitleRef.current = e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor='author' className='text-xl'>
                author of the article
              </Label>
              <Input
                type='text'
                name='author'
                defaultValue=''
                onChange={(e) => (authorRef.current = e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor='content' className='text-xl'>
                content of the article
              </Label>
              <Textarea
                id='content'
                name='title'
                defaultValue=''
                onChange={(e) => (contentRef.current = e.target.value)}
                disabled={isLoading}
                required
                rows={4}
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
              <Label htmlFor='issueId' className='text-xl'>
                Set which issue this article belongs to
              </Label>
              <IssueSelector
                data={issues}
                handleChange={(e: string) => (issueIdRef.current = e)}
              />
            </div>
            <div>
              <Label className='mb-2 block text-lg font-bold text-black'>
                Image upload* - keep filenames unique
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
            <Button type='submit' size='lg' disabled={isLoading}>
              {isLoading ? 'processing...' : 'submit'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
