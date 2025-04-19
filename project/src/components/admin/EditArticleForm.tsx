'use client';

import { useState } from 'react';
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
import { editArticle } from '@/lib/supabase/model';
import { type Tables } from '@/lib/supabase/database';

interface ArticleProps {
  article: Tables<'articles'>;
}

export default function EditArticleForm({ article }: ArticleProps) {
  const [title, setTitle] = useState<string>(article.title);
  const [subtitle, setSubtitle] = useState<string>(article.subtitle);
  const [author, setAuthor] = useState<string>(article.author);
  const [content, setContent] = useState<string>(article.content);

  const [isPublished, setIsPublished] = useState<boolean>(article.is_published);
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
      const newArticle = await editArticle({
        title: title,
        subtitle: subtitle,
        author: author,
        content: content,
        is_published: isPublished,
        issue_id: article.issue_id,
        id: article.id,
      });
      if (newArticle) {
        setSuccess('Article edited successfully!');
        setError('');
      }
    } catch (error) {
      console.log(error);
      alert('Could not edit article. Contact an admin.');
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
                title of the article
              </Label>
              <Input
                type='text'
                name='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
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
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
                required
                rows={40}
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
              Contact an admin if you need to change the following
            </p>
            <p className='mx-1 mt-2 text-blue-600'>
              - This article belongs to the issue with issue_id #
              {article.issue_id}
            </p>
            <p className='mx-1 mt-2 text-blue-600'>
              - Publication Date:{' '}
              {new Date(article.created_at).toLocaleDateString()}
            </p>
            <p className='mx-1 mt-2 text-blue-600'>
              - Image: {article.img_path}
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
