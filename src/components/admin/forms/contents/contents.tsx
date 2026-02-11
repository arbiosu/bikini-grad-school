'use client';

import Link from 'next/link';
import { useContentForm } from '@/hooks/useContentForm';
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
import { Switch } from '@/components/ui/switch';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

import { IssueSelector } from '../../issue-selector';
import { ContentContributorsForm } from '../content-contributors';
import { ContentTagsForm } from '../content-tags';
import { ArticleFormStep } from './steps/article-form-step';
import { FeatureFormStep } from './steps/feature-form-step';
import { InterviewFormStep } from './steps/interview-form-step';
import { ImageUploader } from '../storage/image-uploader';
import { ReviewStep } from './steps/review-step';
import type { Tables } from '@/lib/supabase/database/types';

interface ContentFormProps {
  mode?: 'create' | 'edit';
  issues: Tables<'issues'>[];
  availableContributors: Tables<'contributors'>[];
  creativeRoles: Tables<'creative_roles'>[];
  availableTags: Tables<'tags'>[];
  editData?: {
    content: Tables<'contents'>;
    article?: Tables<'articles'>;
    feature?: Tables<'features'>;
    interview?: Tables<'interviews'>;
    contributors?: Array<{ contributor_id: number; role_id: number }>;
    tags?: Array<{ tag_id: number }>;
  };
}

export function ContentForm(props: ContentFormProps) {
  const {
    mode = 'create',
    issues,
    availableContributors,
    creativeRoles,
    availableTags,
    editData,
  } = props;

  const {
    formData,
    currentStep,
    status,
    canProceed,
    updateField,
    updateTypeData,
    updateContributors,
    updateTags,
    generateSlug,
    goNext,
    goBack,
    submit,
    getStepLabel,
    maxSteps,
    isLoading,
    isSuccess,
    isError,
  } = useContentForm({
    mode,
    editData,
  });

  return (
    <section id='form' className='mx-auto max-w-7xl px-4'>
      {/* Header */}
      <div className='flex max-w-3xl flex-col pb-5'>
        <h6 className='font-bold'>
          {mode === 'create' ? 'Create' : 'Edit'} Content
        </h6>
        <p>Fields marked with * are required.</p>
        <p>
          This is a multi-step form. If you need help, refer to the{' '}
          <Link href='#' className='text-blue-600 underline'>
            guide
          </Link>{' '}
          or contact an Admin.
        </p>
      </div>

      {/* Progress Bar */}
      <div className='pb-5'>
        <div className='mb-2 flex items-center justify-between'>
          <span className='text-sm font-medium'>
            Step {currentStep} of {maxSteps}
          </span>
          <span className='text-sm text-gray-500'>
            {getStepLabel(currentStep)}
          </span>
        </div>
        <div className='h-2 rounded-full bg-gray-200'>
          <div
            className='h-full rounded-full bg-blue-600 transition-all duration-300'
            style={{ width: `${(currentStep / maxSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <div className='max-w-7xl'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === maxSteps) {
              submit();
            }
          }}
          className='space-y-4'
        >
          {/* Step 1: Basic Information */}
          {currentStep >= 1 && (
            <>
              <IssueSelector
                data={issues}
                onChange={(id) => updateField('issue_id', id)}
                value={formData.issue_id}
              />

              <div>
                <Label htmlFor='title'>Title* - Case Sensitive</Label>
                <Input
                  id='title'
                  type='text'
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  onBlur={generateSlug}
                  disabled={isLoading}
                  required
                  placeholder='e.g., Obsession, Coquette'
                />
              </div>

              <div>
                <Label htmlFor='slug'>
                  Slug*
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={generateSlug}
                    className='ml-2'
                  >
                    <Sparkles className='h-4 w-4' />
                    Generate from title
                  </Button>
                </Label>
                <Input
                  id='slug'
                  type='text'
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder='e.g., where-did-coquette-come-from-anyway'
                />
              </div>

              <div>
                <Label htmlFor='summary'>Summary</Label>
                <Input
                  id='summary'
                  type='text'
                  value={formData.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  disabled={isLoading}
                  placeholder='Optional brief description'
                />
              </div>

              <div>
                <Label htmlFor='type'>Content Type*</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => updateField('type', value as any)}
                  disabled={isLoading || mode === 'edit'}
                >
                  <SelectTrigger id='type'>
                    <SelectValue placeholder='select content type...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='article'>Article</SelectItem>
                    <SelectItem value='feature'>Feature</SelectItem>
                    <SelectItem value='interview'>Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='published_at'>
                  Publication Date* - {formData.published_at}
                </Label>
                <Input
                  id='published_at'
                  type='date'
                  value={formData.published_at}
                  onChange={(e) => updateField('published_at', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {mode === 'edit' && (
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='published'
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      updateField('published', checked)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor='published'>
                    Published:{' '}
                    <span className='text-blue-600'>
                      {formData.published ? '(Live)' : '(Draft)'}
                    </span>
                  </Label>
                </div>
              )}

              {mode === 'create' && (
                <div>
                  <Label>Published: (Draft)</Label>
                  <p className='text-sm text-gray-500'>
                    Content will be saved as draft on creation
                  </p>
                </div>
              )}
            </>
          )}

          {/* Step 2: Type-Specific Content */}
          {currentStep >= 2 && (
            <>
              {formData.type === 'article' && (
                <ArticleFormStep
                  data={formData.article || { body: '' }}
                  onChange={(data) => updateTypeData('article', data)}
                  disabled={isLoading}
                />
              )}
              {formData.type === 'feature' && (
                <FeatureFormStep
                  data={formData.feature || { description: '' }}
                  onChange={(data) => updateTypeData('feature', data)}
                  disabled={isLoading}
                />
              )}
              {formData.type === 'interview' && (
                <InterviewFormStep
                  data={
                    formData.interview || {
                      interviewee_name: '',
                      transcript: '',
                    }
                  }
                  onChange={(data) => updateTypeData('interview', data)}
                  disabled={isLoading}
                />
              )}
            </>
          )}

          {/* Step 3: Contributors */}
          {currentStep >= 3 && (
            <ContentContributorsForm
              contributors={formData.contributors}
              onChange={updateContributors}
              availableContributors={availableContributors}
              availableRoles={creativeRoles}
            />
          )}
          {/* Step 4: Tags */}

          {currentStep >= 4 && (
            <ContentTagsForm
              tags={formData.tags}
              onChange={updateTags}
              availableTags={availableTags}
            />
          )}

          {/* Step 5: Cover Image */}

          {currentStep >= 5 && (
            <ImageUploader
              folder='covers'
              value={formData.cover_image_url}
              onChange={(url) => updateField('cover_image_url', url)}
              label='Cover Image'
            />
          )}

          {/* Step 4: Review */}
          {currentStep === 6 && (
            <ReviewStep
              formData={formData}
              issues={issues}
              contributors={availableContributors}
              roles={creativeRoles}
              tags={availableTags}
            />
          )}

          {/* Status Messages */}
          <div className='min-h-5 space-y-2'>
            {isError && status.type === 'error' && (
              <div className='rounded-md bg-red-50 p-4' role='alert'>
                <p className='font-medium text-red-800'>{status.message}</p>
                {status.errors && status.errors.length > 0 && (
                  <ul className='mt-2 list-inside list-disc text-sm text-red-700'>
                    {status.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {isSuccess && status.type === 'success' && (
              <div className='rounded-md bg-green-50 p-4' role='alert'>
                <p className='font-medium text-green-800'>{status.message}</p>
              </div>
            )}
          </div>

          {currentStep === maxSteps && (
            <Button
              type='submit'
              variant='default'
              size='lg'
              disabled={isLoading || !canProceed}
              className='bg-blue-800 text-white'
            >
              {isLoading
                ? 'Processing...'
                : mode === 'create'
                  ? 'Create Content'
                  : 'Save Changes'}
            </Button>
          )}
        </form>

        {/* Navigation */}
        <div className='flex justify-between gap-8 pt-8'>
          <Button
            type='button'
            variant='outline'
            size='lg'
            disabled={currentStep === 1 || isLoading}
            onClick={goBack}
          >
            <ArrowLeft />
            Back
          </Button>
          {currentStep < maxSteps && (
            <Button
              type='button'
              size='lg'
              disabled={isLoading || !canProceed}
              onClick={goNext}
              className='bg-violet-800 text-white'
            >
              Next
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
