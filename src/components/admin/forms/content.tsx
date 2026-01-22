'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
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
import { IssueSelector } from '../issue-selector';
import { ContentContributorsForm } from './content-contributors';

import { ArrowRight, ArrowLeft } from 'lucide-react';

import { createContent } from '@/lib/supabase/model/contents';
import { createArticle } from '@/lib/supabase/model/articles';
import { createInterview } from '@/lib/supabase/model/interviews';
import { createFeature } from '@/lib/supabase/model/features';
import { createContentContributor } from '@/lib/supabase/model/contentContributors';

import { isValidSlug } from '@/lib/utils';
import { Tables, TablesInsert } from '@/lib/supabase/database/types';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type ContentTypes = 'article' | 'feature' | 'interview' | 'digi_media';

interface ContentContributor {
  contentContributorId: number;
  creativeRoleId: number;
  contentId?: number;
}

interface CreateContentFormData {
  issueId: number;
  published: boolean;
  publicationDate: string;
  slug: string;
  summary: string;
  title: string;
  type: ContentTypes;

  articleBody?: string;
  featureDescription?: string;
  interviewTranscript?: string;
  intervieweeName?: string;
  intervieweeBio?: string;
  interviewProfileImage?: string; // todo

  contributors?: ContentContributor[];
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  message: string | null;
}

const INITIAL_FORM_DATA: CreateContentFormData = {
  issueId: 0,
  published: false,
  title: '',
  summary: '',
  type: 'article',
  slug: '',
  publicationDate: new Date().toLocaleDateString(), // todo time
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
  message: null,
};

const MAX_STEPS = 5;

interface CreateContentFormProps {
  issues: Tables<'issues'>[];
  contributors: Tables<'contributors'>[];
  creativeRoles: Tables<'creative_roles'>[];
}

export function CreateContentForm({
  issues,
  contributors,
  creativeRoles,
}: CreateContentFormProps) {
  const [formData, setFormData] =
    useState<CreateContentFormData>(INITIAL_FORM_DATA);
  const [formStep, setFormStep] = useState<number>(1);
  const [contentContributors, setContentContributors] = useState<
    ContentContributor[]
  >([]);
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);

  const handleNext = () => {
    setFormStep((prev) => (prev > MAX_STEPS ? prev : prev + 1));
  };

  const handleBack = () => {
    setFormStep((prev) => (prev === 1 ? prev : prev - 1));
  };

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFormStep(1);
    setContentContributors([]);
  }, []);

  const handleFieldChange = useCallback(
    (
      field: keyof CreateContentFormData,
      value: string | ContentTypes | boolean | number
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (status.error || status.success) {
        setStatus(INITIAL_STATUS);
      }
    },
    [status.error, status.success]
  );

  const validateForm = (): boolean => {
    setStatus({
      isLoading: true,
      error: null,
      success: null,
      message: 'Validating form...Analyzing...beep boop..',
    });

    if (formData.issueId === 0) {
      setStatus({
        isLoading: false,
        error: 'Please select a valid issue.',
        success: null,
        message: null,
      });
      return false;
    }

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      setStatus({
        isLoading: false,
        error: 'Title is required',
        success: null,
        message: null,
      });
      return false;
    }
    const trimmedSlug = formData.slug.trim();
    if (!trimmedSlug) {
      setStatus({
        isLoading: false,
        error: 'A unique, valid Slug is required',
        success: null,
        message: null,
      });
      return false;
    }
    if (!isValidSlug(trimmedSlug)) {
      setStatus({
        isLoading: false,
        error: 'This Slug is not valid.',
        success: null,
        message: null,
      });
      return false;
    }

    // todo: check against all slugs for unique
    setStatus({
      isLoading: true,
      error: null,
      success: null,
      message: 'Step 1: All clear...',
    });

    switch (formData.type) {
      case 'article':
        if (formData.articleBody == null) {
          setStatus({
            isLoading: true,
            error: 'Article body is empty or invalid!',
            success: null,
            message: null,
          });
          return false;
        }
        break;
      case 'feature':
        if (formData.featureDescription == null) {
          setStatus({
            isLoading: true,
            error: 'Feature description is empty or invalid!',
            success: null,
            message: null,
          });
          return false;
        }
        break;
      case 'interview':
        if (
          formData.intervieweeBio == null ||
          formData.intervieweeName == null ||
          formData.interviewTranscript == null
        ) {
          setStatus({
            isLoading: true,
            error: 'Interview section is invalid!',
            success: null,
            message: null,
          });
          return false;
        }
        break;
      case 'digi_media':
        break;
      default:
        break;
    }

    setStatus({
      isLoading: true,
      error: null,
      success: null,
      message: 'Step 2: All clear...',
    });

    const invalidContributors = contentContributors.filter(
      (c) => c.contentContributorId === 0 || c.creativeRoleId == 0
    );

    if (invalidContributors.length > 0) {
      setStatus({
        isLoading: false,
        error: 'Please assign both a contributor and a role for each entry.',
        success: null,
        message: null,
      });
      return false;
    }
    if (contentContributors.length < 1) {
      setStatus({
        isLoading: false,
        error: 'Please assign both a contributor and a role for each entry.',
        success: null,
        message: null,
      });
      return false;
    }
    setStatus({
      isLoading: true,
      error: null,
      success: null,
      message: 'Step 3: All clear...form validated',
    });
    return true;
    // todo: check images
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isLoading: true, error: null, success: null, message: null });

    const validated = validateForm();

    if (!validated) return;

    console.log('validated', validated);

    try {
      const data = {
        issue_id: formData.issueId,
        published: false,
        published_at: formData.publicationDate,
        slug: formData.slug.trim(),
        summary: formData.summary,
        title: formData.title.trim(),
        type: formData.type,
      };
      const { data: insertData, error } = await createContent(data);
      if (insertData) {
        setStatus({
          isLoading: false,
          error: null,
          message: null,
          success: `Content saved to database! Title: ${formData.title}. Proceeding to upload ${formData.type} related data...`,
        });
        switch (formData.type) {
          case 'article':
            const article = {
              id: insertData.id,
              body: formData.articleBody ?? '',
            };
            const { data: articleData, error: articleError } =
              await createArticle(article);
            if (articleError || !articleData) {
              setStatus({
                isLoading: false,
                error: articleError,
                message:
                  'There was an error inserting the contents TYPE data. Please ensure the TYPE data is all valid, or contact an Admin.',
                success: null,
              });
              return;
            }
            setStatus({
              isLoading: false,
              error: null,
              message: null,
              success: `Article has been saved to database! ID: ${articleData.id}. Proceeding to upload contributor related data...`,
            });
            break;
          case 'feature':
            const feature = {
              id: insertData.id,
              description: formData.featureDescription,
            };
            const { data: featureData, error: featureError } =
              await createFeature(feature);
            if (featureError || !featureData) {
              setStatus({
                isLoading: false,
                error: featureError,
                message:
                  'There was an error inserting the contents TYPE data. Please ensure the TYPE data is all valid, or contact an Admin.',
                success: null,
              });
              return;
            }
            setStatus({
              isLoading: false,
              error: null,
              message: null,
              success: `Feature has been saved to database! ID: ${featureData.id}. Proceeding to upload contributor related data...`,
            });
            break;
          case 'interview':
            const interview = {
              id: insertData.id,
              interviewee_bio: formData.intervieweeBio ?? '',
              interviewee_name: formData.intervieweeName ?? '',
              transcript: formData.interviewTranscript ?? '',
            };
            const { data: interviewData, error: interviewError } =
              await createInterview(interview);
            if (interviewError || !interviewData) {
              setStatus({
                isLoading: false,
                error: interviewError,
                message:
                  'There was an error inserting the contents TYPE data. Please ensure the TYPE data is all valid, or contact an Admin.',
                success: null,
              });
              return;
            }
            setStatus({
              isLoading: false,
              error: null,
              message: null,
              success: `Interview has been saved to database! ID: ${interviewData.id}. Proceeding to upload contributor related data...`,
            });
            break;
          case 'digi_media':
            break;
          default:
            break;
        }
        const finalContributors: TablesInsert<'content_contributors'>[] = [];
        for (const contributor of contentContributors) {
          finalContributors.push({
            content_id: insertData.id,
            contributor_id: contributor.contentContributorId,
            role_id: contributor.creativeRoleId,
          });
        }
        const { data: contributorData, error: contributorError } =
          await createContentContributor(finalContributors);
        if (contributorError || !contributorData) {
          setStatus({
            isLoading: false,
            error: contributorError,
            success: null,
            message:
              'There was an error assigning contributors to this piece of content.',
          });
          return;
        }
        resetForm();
        setStatus({
          isLoading: false,
          error: error,
          success: `Contributors assigned to this piece of content and saved to the database!. To access this content for further editing TODO. \n DETAILS: title: ${insertData.title}\n Status: ${insertData.published ? 'PUBLISHED' : 'DRAFT'}\n Issue ID: ${insertData.issue_id}`,
          message: null,
        });
      } else {
        setStatus({
          isLoading: false,
          error: error,
          success: null,
          message: null,
        });
        return;
      }
    } catch (e) {
      let errorMessage =
        'Could not create content. Please try again or contact an admin.';
      if (e instanceof Error) {
        errorMessage = `Failed to create content: ${e.message}`;
      }
      setStatus({
        isLoading: false,
        error: errorMessage,
        success: null,
        message: null,
      });
    }
  };

  const isSubmitDisabled =
    status.isLoading ||
    !formData.title.trim() ||
    formData.issueId === 0 ||
    formData.slug === '';

  return (
    <section id='form' className='mx-auto max-w-7xl px-4'>
      <div className='flex max-w-3xl flex-col pb-5'>
        <h6 className='font-bold'>New Content Form</h6>
        <p>Fields marked with * are required.</p>
        <p>
          This is a multi-step form. If you need help, refer to the{' '}
          <Link href='#' className='text-blue-600 underline'>
            guide
          </Link>{' '}
          or contact an Admin.
        </p>
      </div>

      <div className='pb-5'>
        <div className='mb-2 flex items-center justify-between'>
          <span className='text-sm font-medium'>
            Step {formStep} of {MAX_STEPS}
          </span>
          <span className='text-sm text-gray-500'>
            {formStep === 1 ? 'Basic Information' : 'Content Details'}
          </span>
        </div>
        <div className='h-2 rounded-full bg-gray-200'>
          <div
            className='h-full rounded-full bg-blue-600 transition-all duration-300'
            style={{ width: `${(formStep / MAX_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className='max-w-7xl'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <IssueSelector
            data={issues}
            onChange={(id) => handleFieldChange('issueId', id)}
            value={formData.issueId}
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
            <Label htmlFor='published'>Status: DRAFT</Label>
          </div>

          {formStep >= 2 && (
            <>
              {formData.type === 'article' && (
                <div>
                  <Label htmlFor='articleBody'>Article Body*</Label>
                  <MDEditor
                    id='articleBody'
                    data-color-mode='light'
                    value={formData.articleBody || ''}
                    onChange={(value = '') =>
                      handleFieldChange('articleBody', value)
                    }
                    height={500}
                    preview='edit'
                    textareaProps={{
                      name: 'body',
                      id: 'body',
                      required: true,
                    }}
                  />
                </div>
              )}
              {formData.type === 'feature' && (
                <div>
                  <Label htmlFor='description'>Description*</Label>
                  <Input
                    id='description'
                    type='text'
                    value={formData.featureDescription || ''}
                    onChange={(e) =>
                      handleFieldChange('featureDescription', e.target.value)
                    }
                    disabled={status.isLoading}
                    required
                  />
                </div>
              )}
              {formData.type === 'interview' && (
                <>
                  <div>
                    <Label htmlFor='intervieweeName'>Interviewee Name*</Label>
                    <Input
                      id='intervieweeName'
                      type='text'
                      value={formData.intervieweeName || ''}
                      onChange={(e) =>
                        handleFieldChange('intervieweeName', e.target.value)
                      }
                      disabled={status.isLoading}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='intervieweeBio'>Interviewee Bio</Label>
                    <Input
                      id='intervieweeBio'
                      type='text'
                      value={formData.intervieweeBio || ''}
                      onChange={(e) =>
                        handleFieldChange('intervieweeBio', e.target.value)
                      }
                      disabled={status.isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor='transcript'>Transcript*</Label>
                    <MDEditor
                      id='transcript'
                      value={formData.interviewTranscript || ''}
                      onChange={(value = '') =>
                        handleFieldChange('interviewTranscript', value)
                      }
                      height={500}
                      preview='edit'
                      textareaProps={{
                        name: 'body',
                        id: 'body',
                        required: true,
                      }}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {formStep >= 3 && (
            <>
              <ContentContributorsForm
                contributors={contentContributors}
                onChange={setContentContributors}
                availableContributors={contributors}
                availableRoles={creativeRoles}
              />
            </>
          )}

          <div className='mt-4 min-h-5'>
            {' '}
            {status.message && <p>MESSAGE: {status.success}</p>}
            {status.error && (
              <p className='text-red-600'>ERROR: {status.error}</p>
            )}
            {status.success && (
              <p className='text-green-600'>SUCCESS: {status.success}</p>
            )}
          </div>
          {formStep === MAX_STEPS && (
            <Button
              type='submit'
              variant={'outline'}
              size='lg'
              disabled={isSubmitDisabled ? true : formStep < 5 ? true : false}
              className='bg-blue-800 text-white'
            >
              {status.isLoading ? 'Processing...' : 'Final Submit'}
            </Button>
          )}
        </form>
        <div className='flex gap-8 pt-8'>
          <Button
            type='button'
            variant={'outline'}
            size='lg'
            disabled={isSubmitDisabled}
            onClick={handleBack}
          >
            <ArrowLeft />
            {'Back'}
          </Button>
          <Button
            type='button'
            size='lg'
            disabled={isSubmitDisabled}
            onClick={handleNext}
            className='bg-violet-800 text-white'
          >
            {'Next'}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
