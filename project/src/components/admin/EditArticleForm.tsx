'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
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
import { editArticle } from '@/lib/supabase/model/articles';
import { type Tables } from '@/lib/supabase/database';

interface EditArticleFormData {
  title: string;
  subtitle: string;
  author: string;
  content: string;
  isPublished: boolean;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const PUBLISH_STATUS = {
  PUBLISHED: 'true',
  DRAFT: 'false',
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

interface ArticleProps {
  article: Tables<'articles'>;
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function EditArticleForm({ article }: ArticleProps) {
  const [formData, setFormData] = useState<EditArticleFormData>({
    title: article.title,
    subtitle: article.subtitle,
    author: article.author,
    content: article.content,
    isPublished: article.is_published,
  });
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

  const handlePublishedChange = useCallback(
    (value: string) => {
      setFormData((prevData) => ({
        ...prevData,
        isPublished: value === PUBLISH_STATUS.PUBLISHED,
      }));
      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isLoading: true, error: null, success: null });

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      setStatus({
        isLoading: false,
        error: 'Title is required',
        success: null,
      });
      return;
    }
    const trimmedSubtitle = formData.subtitle.trim();
    if (!trimmedSubtitle) {
      setStatus({
        isLoading: false,
        error: 'Subtitle is required',
        success: null,
      });
      return;
    }
    const trimmedAuthor = formData.author.trim();
    if (!trimmedAuthor) {
      setStatus({
        isLoading: false,
        error: 'Author is required',
        success: null,
      });
      return;
    }

    try {
      const newArticle = await editArticle({
        title: trimmedTitle,
        subtitle: trimmedSubtitle,
        author: trimmedAuthor,
        content: formData.content,
        is_published: formData.isPublished,
        issue_id: article.issue_id,
        id: article.id,
      });
      if (newArticle.data) {
        setStatus({
          isLoading: false,
          error: null,
          success: 'Article updated successfully!',
        });
      } else {
        setStatus({ isLoading: false, error: newArticle.error, success: null });
      }
    } catch (error) {
      console.error(error);
      let errorMessage = 'Could not edit article. Contact an admin.';
      if (error instanceof Error) {
        errorMessage = `Failed to edit article: ${error.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };

  return (
    <div className='mx-auto max-w-6xl p-2'>
      <div className='flex flex-col gap-24 md:flex-row'>
        <div className='flex-1'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='title' className='text-xl'>
                Title*
              </Label>
              <Input
                id='title'
                type='text'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                disabled={status.isLoading}
                required
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='subtitle' className='text-xl'>
                Subtitle*
              </Label>
              <Input
                id='subtitle'
                type='text'
                name='subtitle'
                value={formData.subtitle}
                onChange={handleInputChange}
                disabled={status.isLoading}
                required
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='author' className='text-xl'>
                Author*
              </Label>
              <Input
                id='author'
                type='text'
                name='author'
                value={formData.author}
                onChange={handleInputChange}
                disabled={status.isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor='content' className='text-xl'>
                Content*
              </Label>
              <MDEditor
                value={formData.content}
                onChange={(value = '') =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                height={500}
                preview='edit'
                textareaProps={{
                  name: 'content',
                  id: 'content',
                  required: true,
                }}
              />
            </div>
            <div>
              <Label htmlFor='is_published' className='text-xl'>
                Status*
              </Label>
              <Select
                onValueChange={handlePublishedChange}
                value={
                  formData.isPublished
                    ? PUBLISH_STATUS.PUBLISHED
                    : PUBLISH_STATUS.DRAFT
                }
                disabled={status.isLoading}
                name='is_published'
                required
              >
                <SelectTrigger id='is_published'>
                  <SelectValue placeholder='Select status...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PUBLISH_STATUS.PUBLISHED}>
                    Published
                  </SelectItem>
                  <SelectItem value={PUBLISH_STATUS.DRAFT}>Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='mt-4 min-h-[20px]'>
              {' '}
              {/* Reserve space to prevent layout shifts */}
              {status.error && <p className='text-red-600'>{status.error}</p>}
              {status.success && (
                <p className='text-green-600'>{status.success}</p>
              )}
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
            <Button type='submit' size='lg' disabled={status.isLoading}>
              {status.isLoading ? 'processing...' : 'submit'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
