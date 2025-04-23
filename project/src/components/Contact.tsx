'use client';

import type React from 'react';

import { useState, useCallback } from 'react';
import { validateEmail } from '@/lib/utils';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ContactFormData {
  name: string;
  email: string;
  topic: string;
  message: string;
  source: string;
}

interface FormStatus {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  topic: '',
  message: '',
  source: '',
};

const INITIAL_STATUS: FormStatus = {
  isLoading: false,
  error: null,
  success: null,
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<FormStatus>(INITIAL_STATUS);

  const resetStatus = useCallback(() => {
    if (status.error || status.success) {
      setStatus(INITIAL_STATUS);
    }
  }, [status.error, status.success]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      resetStatus();
    },
    [resetStatus]
  );

  const handleSourceChange = useCallback(
    (value: string) => {
      setFormData((prevData) => ({
        ...prevData,
        source: value,
      }));
      resetStatus();
    },
    [resetStatus]
  );

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
  }, []);

  const validateForm = (): boolean => {
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      topic: formData.topic.trim(),
      message: formData.message.trim(),
      source: formData.source,
    };
    if (!trimmedData.topic) {
      setStatus({
        isLoading: false,
        error: 'Topic is required.',
        success: null,
      });
      return false;
    }
    if (!trimmedData.name) {
      setStatus({
        isLoading: false,
        error: 'Name is required.',
        success: null,
      });
      return false;
    }
    if (!trimmedData.email) {
      setStatus({
        isLoading: false,
        error: 'Email is required.',
        success: null,
      });
      return false;
    }
    if (!validateEmail(trimmedData.email)) {
      setStatus({
        isLoading: false,
        error: 'Invalid email address format.',
        success: null,
      });
      return false;
    }
    if (!trimmedData.message) {
      setStatus({
        isLoading: false,
        error: 'Message is required.',
        success: null,
      });
      return false;
    }
    if (!trimmedData.source) {
      setStatus({
        isLoading: false,
        error: 'Please select where you heard about us.',
        success: null,
      });
      return false;
    }
    setStatus(INITIAL_STATUS);
    setFormData(() => ({
      ...trimmedData,
    }));
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setStatus({ isLoading: true, error: null, success: null });

    try {
      const res = await fetch('/api/email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setStatus({
            isLoading: false,
            error: `Too many contact attempts. Please try again in ${data.resetInMinutes} minutes.`,
            success: null,
          });
        }
        setStatus({
          isLoading: false,
          error: data.error,
          success: null,
        });
        console.log(data);
        return;
      }
      setStatus({
        isLoading: false,
        error: null,
        success:
          'We got your message. Thanks for reaching out! Expect an answer in ~72 hours',
      });
      resetForm();
    } catch (error) {
      console.error('Failed to send contact form:', error);
      setStatus({
        isLoading: false,
        error: 'An unexpected error occurred. Please try again later.',
        success: null,
      });
    }
  };

  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h3 className='mb-6 text-lg'>fields marked * are required</h3>
      <div className='flex flex-col gap-24 md:flex-row'>
        {/* Form Section */}
        <div className='flex-1'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='topic' className='text-xl'>
                topic*
              </Label>
              <Input
                id='topic'
                type='text'
                name='topic'
                value={formData.topic}
                onChange={handleInputChange}
                placeholder='Enter the topic of your message'
                disabled={status.isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor='name' className='text-xl'>
                name + pronouns*
              </Label>
              <Input
                id='name'
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                placeholder='Your name and pronouns'
                disabled={status.isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor='email' className='text-xl'>
                email*
              </Label>
              <Input
                id='email'
                type='text'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='example@email.com'
                disabled={status.isLoading}
                required
              />
            </div>
            <div>
              <Label htmlFor='message' className='text-xl'>
                message*
              </Label>
              <Textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleInputChange}
                placeholder='Your message'
                disabled={status.isLoading}
                required
                rows={8}
              />
            </div>

            <div>
              <Label htmlFor='source' className='text-xl'>
                where did you hear about Bikini Grad School?*
              </Label>
              <Select
                onValueChange={handleSourceChange}
                value={formData.source}
                disabled={status.isLoading}
                name='isPublished'
                required
              >
                <SelectTrigger className='w-[180px]' id='source'>
                  <SelectValue placeholder='Select a source' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>sources</SelectLabel>
                    <SelectItem value='tiktok'>tiktok</SelectItem>
                    <SelectItem value='instagram'>instagram</SelectItem>
                    <SelectItem value='family-friends'>
                      family/friends
                    </SelectItem>
                    <SelectItem value='other'>other</SelectItem>
                  </SelectGroup>
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
            <Button type='submit' size={'lg'} disabled={status.isLoading}>
              {status.isLoading ? 'processing...' : 'submit message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
