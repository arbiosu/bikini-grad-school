'use client';

import { useState, useRef, useCallback } from 'react';
import { createArticle } from '@/lib/supabase/model/articles';
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
import IssueSelector from './IssueSelector';
import { type Tables } from '@/lib/supabase/database';

interface ArticleFormData {
  title: string;
  subtitle: string;
  author: string;
  content: string;
  issueId: number;
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

const INITIAL_FORM_DATA: ArticleFormData = {
  title: '',
  subtitle: '',
  author: '',
  content: '',
  issueId: 1,
  isPublished: false,
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

interface IssuesProps {
  issues: Tables<'issues'>[];
}

export default function CreateNewArticleForm({ issues }: IssuesProps) {
  const [formData, setFormData] = useState<ArticleFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentFile = e.target.files?.[0] || null;
      setFile(currentFile);
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
  const handleIssueIdChange = useCallback(
    (id: string) => {
      setFormData((prevData) => ({
        ...prevData,
        issueId: parseInt(id),
      }));
      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

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

    if (!file) {
      setStatus({
        isLoading: false,
        error: 'Please upload a cover image',
        success: null,
      });
      return;
    }

    try {
      const articleData = {
        title: trimmedTitle,
        subtitle: trimmedSubtitle,
        author: trimmedAuthor,
        content: formData.content,
        is_published: formData.isPublished,
        issue_id: formData.issueId,
      };
      const newArticle = await createArticle(articleData, file);
      if (newArticle.data) {
        setStatus({
          isLoading: false,
          error: null,
          success: 'Article created successfully!',
        });
        resetForm();
      } else {
        setStatus({ isLoading: false, error: newArticle.error, success: null });
      }
    } catch (error) {
      console.error(error);
      let errorMessage = 'Could not create article. Contact an admin.';
      if (error instanceof Error) {
        errorMessage = `Failed to create article: ${error.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };
  const isSubmitDisabled = status.isLoading || !file || !formData.title.trim();
  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h2 className='mb-6 text-2xl font-semibold'>Create New Article</h2>
      <p className='mb-6 text-sm'>
        Fill in the details for the new magazine article. Fields marked with *
        are required.
      </p>
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
                placeholder='Enter the article title'
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
                placeholder='Enter the article subtitle'
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
                placeholder='Enter the name of the author of the article'
                disabled={status.isLoading}
                required
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='content' className='text-xl'>
                Content*
              </Label>
              <Textarea
                id='content'
                name='content'
                value={formData.content}
                onChange={handleInputChange}
                placeholder='Separate paragraphs by two line breaks. Indentation will be automatically applied.'
                disabled={status.isLoading}
                required
                rows={40}
                className='mt-1'
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
              <p className='mt-1 text-sm text-gray-500'>
                {
                  "'Published' issues are live immediately. 'Draft' issues are hidden."
                }
              </p>
            </div>
            <div>
              <Label htmlFor='issueId' className='text-xl'>
                Set which issue this article belongs to
              </Label>
              <IssueSelector data={issues} handleChange={handleIssueIdChange} />
            </div>
            <div>
              <Label className='mb-2 block text-lg font-bold text-black'>
                Image upload* - keep filenames unique
              </Label>
              <Input
                id='coverImage'
                name='coverImage'
                type='file'
                accept='image/png'
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={status.isLoading}
                required
              />
              <p className='mt-1 text-sm text-gray-500'>
                10Mb file size limit. We optimize the image by converting it to
                WebP format and generating 5 cropped versions. Keep filenames
                unique (e.g., article-101.jpg).
              </p>
            </div>
            <div className='mt-4 min-h-[20px]'>
              {' '}
              {/* Reserve space to prevent layout shifts */}
              {status.error && <p className='text-red-600'>{status.error}</p>}
              {status.success && (
                <p className='text-green-600'>{status.success}</p>
              )}
            </div>
            <Button type='submit' size='lg' disabled={isSubmitDisabled}>
              {status.isLoading ? 'Processing...' : 'Submit Article'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
