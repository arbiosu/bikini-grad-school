'use client';

import { useState, useCallback } from 'react';

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

import { ArticleForm } from './article';
import { FeatureForm } from './feature';
import { InterviewForm } from './interview';
import { ContentContributorsForm } from './content-contributors';
import { IssueSelector } from '../issue-selector';

import { createFullContent } from '@/lib/supabase/model/contents';

import { slugify, isValidSlug } from '@/lib/utils';

import { Tables } from '@/lib/supabase/database/types';

type ContentTypes = 'article' | 'feature' | 'interview' | 'digi_media';
type FormStep = 'base' | 'typeSpecific' | 'contributors';

interface CreateContentFormData {
  issueId: number;
  published: boolean;
  publicationDate: string;
  slug: string;
  summary: string;
  title: string;
  type: ContentTypes;
}

interface CreateArticleFormData {
  body: string;
  featuredImage: string | null;
}

interface CreateFeatureFormData {
  description: string;
}

interface CreateInterviewFormData {
  intervieweeBio: string | null;
  intervieweeName: string;
  profile_image: string | null;
  transcript: string;
}

interface CreateDigiMediaFormData {
  mediaUrl: string;
}

type TypeSpecificData =
  | ({ type: 'article' } & CreateArticleFormData)
  | ({ type: 'feature' } & CreateFeatureFormData)
  | ({ type: 'interview' } & CreateInterviewFormData)
  | ({ type: 'digi_media' } & CreateDigiMediaFormData);

interface ContentContributor {
  contributorId: number;
  roleId: number;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const INITIAL_FORM_DATA: CreateContentFormData = {
  issueId: 0,
  published: false,
  title: '',
  summary: '',
  type: 'article',
  slug: '',
  publicationDate: new Date().toLocaleDateString(),
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

interface CreateContentFormProps {
  issues: Tables<'issues'>[];
  availableContributors: Tables<'contributors'>[];
  availableRoles: Tables<'creative_roles'>[];
}

export function CreateContentForm({
  issues,
  availableContributors,
  availableRoles,
}: CreateContentFormProps) {
  const [step, setStep] = useState<FormStep>('base');
  const [formData, setFormData] =
    useState<CreateContentFormData>(INITIAL_FORM_DATA);
  const [typeSpecificData, setTypeSpecificData] =
    useState<TypeSpecificData | null>(null);
  const [contributors, setContributors] = useState<ContentContributor[]>([]);

  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);

  const handleFieldChange = useCallback(
    (
      field: keyof CreateContentFormData,
      value: string | ContentTypes | boolean | number
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (field === 'type') {
        switch (value as ContentTypes) {
          case 'article':
            setTypeSpecificData({
              type: 'article',
              body: '',
              featuredImage: null,
            });
            break;
          case 'feature':
            setTypeSpecificData({
              type: 'feature',
              description: '',
            });
            break;
          case 'interview':
            setTypeSpecificData({
              type: 'interview',
              intervieweeName: '',
              intervieweeBio: null,
              profile_image: null,
              transcript: '',
            });
            break;
          case 'digi_media':
            setTypeSpecificData({
              type: 'digi_media',
              mediaUrl: '',
            });
            break;
        }
      }

      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

  const handleTypeSpecificChange = useCallback(
    <K extends keyof Omit<TypeSpecificData, 'type'>>(
      field: K,
      value: TypeSpecificData[K]
    ) => {
      setTypeSpecificData((prev) => {
        if (!prev) return prev;

        switch (prev.type) {
          case 'article':
            if (field === 'body' || field === 'featuredImage') {
              return { ...prev, [field]: value } as TypeSpecificData;
            }
            return prev;

          case 'feature':
            if (field === 'description') {
              return { ...prev, description: value as string };
            }
            return prev;

          case 'interview':
            if (
              field === 'intervieweeName' ||
              field === 'intervieweeBio' ||
              field === 'profile_image' ||
              field === 'transcript'
            ) {
              return { ...prev, [field]: value } as TypeSpecificData;
            }
            return prev;

          case 'digi_media':
            if (field === 'mediaUrl') {
              return { ...prev, mediaUrl: value as string };
            }
            return prev;
        }
      });

      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setTypeSpecificData(null);
    setStep('base');
  }, []);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      setStatus({
        isLoading: false,
        error: 'Title is required',
        success: null,
      });
      return;
    }

    if (slugify(formData.slug) !== formData.slug) {
      setStatus({
        isLoading: false,
        error: 'Slug is not valid.',
        success: null,
      });
      return;
    }

    setStep('typeSpecific');
  };

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
    const trimmedSlug = formData.slug.trim();
    if (!trimmedSlug) {
      setStatus({
        isLoading: false,
        error: 'A unique, valid Slug is required',
        success: null,
      });
      return;
    }
    if (!isValidSlug(trimmedSlug)) {
      setStatus({
        isLoading: false,
        error: 'This Slug is not valid.',
        success: null,
      });
      return;
    }
    if (formData.issueId === 0) {
      setStatus({
        isLoading: false,
        error: 'Please select a valid issue.',
        success: null,
      });
      return;
    }

    const invalidContributors = contributors.filter(
      (c) => c.contributorId === 0 || c.roleId == 0
    );

    if (invalidContributors.length > 0) {
      setStatus({
        isLoading: false,
        error: 'Please assign both a contributor and a role for each entry.',
        success: null,
      });
      return;
    }
    if (contributors.length < 1) {
      setStatus({
        isLoading: false,
        error: 'Please assign both a contributor and a role for each entry.',
        success: null,
      });
      return;
    }
    try {
      const finalContentData = {
        issue_id: formData.issueId,
        published: formData.published,
        published_at: formData.publicationDate,
        slug: trimmedSlug,
        summary: formData.summary,
        title: trimmedTitle,
        type: formData.type,
      };
      const finalContributors = contributors.map((c) => ({
        contributorId: c.contributorId,
        roleId: c.roleId,
      }));

      if (typeSpecificData == null) return;

      const { data: insertData, error } = await createFullContent(
        finalContentData,
        finalContributors,
        typeSpecificData
      );
      if (insertData) {
        setStatus({
          isLoading: false,
          error: null,
          success: `Content added to issue with ID ${formData.issueId} ${'\n'} Title: ${trimmedTitle} Type: ${formData.type}`,
        });
      } else {
        setStatus({ isLoading: false, error: error, success: null });
      }
    } catch (e) {
      let errorMessage =
        'Could not create content. Please try again or contact an admin.';
      if (e instanceof Error) {
        errorMessage = `Failed to create content: ${e.message}`;
      }
      setStatus({ isLoading: false, error: errorMessage, success: null });
    }
  };

  const renderTypeSpecificForm = () => {
    const commonProps = {
      data: typeSpecificData,
      onChange: handleTypeSpecificChange,
      isLoading: status.isLoading,
    };

    switch (formData.type) {
      case 'article':
        return <ArticleForm {...commonProps} />;
      case 'feature':
        return <FeatureForm {...commonProps} />;
      case 'interview':
        return <InterviewForm {...commonProps} />;
    }
  };

  const isSubmitDisabled =
    status.isLoading || !formData.title.trim() || step === 'typeSpecific';

  return (
    <section id='form'>
      <div className='flex justify-center'>
        <h1 className='mb-4 text-xl'>New Content Form</h1>
      </div>
      <div className='mb-8 flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <div
            className={`rounded px-4 py-2 ${step === 'base' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            1. Base Info
          </div>
          <div className='h-0.5 w-8 bg-gray-300' />
          <div
            className={`rounded px-4 py-2 ${step === 'typeSpecific' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            2.{' '}
            {formData.type.charAt(0).toUpperCase() +
              formData.type.slice(1).replace('_', ' ')}{' '}
            Details
          </div>
        </div>
      </div>
      <div className='max-w-full'>
        <form onSubmit={handleNextStep} className='space-y-4'>
          <IssueSelector
            data={issues}
            onChange={(id) => handleFieldChange('issueId', id)}
            value={formData.issueId}
          />
          <ContentContributorsForm
            contributors={contributors}
            onChange={setContributors}
            availableContributors={availableContributors}
            availableRoles={availableRoles}
            isLoading={status.isLoading}
          />
          <div>
            <Label htmlFor='title'>Title* - cAsE SeNsItivE</Label>
            <Input
              id='title'
              type='text'
              name='title'
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              disabled={status.isLoading}
              required
              placeholder='(e.g., obsession, coquette)'
            />
          </div>
          <div>
            <Label htmlFor='summary'>Summary</Label>
            <Input
              id='summary'
              type='text'
              name='summary'
              value={formData.summary}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              disabled={status.isLoading}
              required
              placeholder='(e.g., whatever you would like to say here)'
            />
          </div>
          <div>
            <Label htmlFor='slug'>Slug*</Label>
            <Input
              id='slug'
              type='text'
              name='slug'
              value={formData.slug}
              onChange={(e) => handleFieldChange('slug', e.target.value)}
              disabled={status.isLoading}
              required
              placeholder='(e.g., where-did-coquette-come-from-anyway)'
            />
          </div>
          <div>
            <Label htmlFor='published'>Published Status*</Label>
            <Select
              onValueChange={(value) =>
                handleFieldChange('published', value === 'true')
              }
              value={formData.published ? 'true' : 'false'}
              disabled={status.isLoading}
              name='published'
              required
            >
              <SelectTrigger id='published'>
                <SelectValue placeholder='Select status...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'true'}>Published</SelectItem>
                <SelectItem value={'false'}>Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='publicationDate'>
              Publication Date* - {formData.publicationDate}
            </Label>
            <Input
              id='publicationDate'
              type='date'
              name='publicationDate'
              value={formData.publicationDate}
              onChange={(e) =>
                handleFieldChange('publicationDate', e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor='type'>Type*</Label>
            <Select
              name='type'
              value={formData.type}
              onValueChange={(value) => handleFieldChange('type', value)}
              disabled={status.isLoading}
              required
            >
              <SelectTrigger id='type'>
                <SelectValue placeholder='select content type...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'article'}>Article</SelectItem>
                <SelectItem value={'feature'}>Feature</SelectItem>
                <SelectItem value={'interview'}>Interview</SelectItem>
                <SelectItem value={'digi_media'}>Digi Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='mt-4 min-h-[20px]'>
            {' '}
            {status.error && (
              <p className='text-red-600'>ERROR: {status.error}</p>
            )}
            {status.success && (
              <p className='text-green-600'>SUCCESS: {status.success}</p>
            )}
          </div>
          <Button
            type='submit'
            variant={'outline'}
            size='lg'
            disabled={isSubmitDisabled}
            className='bg-emerald-600 disabled:bg-emerald-600/10'
          >
            {status.isLoading
              ? 'Processing...'
              : 'Submit Basic Information on Content and Continue to Step 2'}
          </Button>
        </form>
      </div>
      {step === 'typeSpecific' && (
        <form onSubmit={handleSubmit}>
          {renderTypeSpecificForm()}
          <div className='mt-4 min-h-[20px]'>
            {status.error && <p className='text-red-600'>{status.error}</p>}
            {status.success && (
              <p className='text-green-600'>{status.success}</p>
            )}
          </div>

          <div className='flex gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setStep('base')}
              disabled={status.isLoading}
            >
              Back
            </Button>
            <Button
              type='submit'
              variant='outline'
              size='lg'
              disabled={status.isLoading}
            >
              {status.isLoading ? 'Creating...' : 'Create Content'}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
