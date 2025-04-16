'use client';

import type React from 'react';

import { useState, useRef } from 'react';
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

export default function ContactForm() {
  const nameRef = useRef('');
  const emailRef = useRef('');
  const topicRef = useRef('');
  const messageRef = useRef('');
  const sourceRef = useRef('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get current ref values
    const formData = {
      name: nameRef.current,
      email: emailRef.current,
      topic: topicRef.current,
      message: messageRef.current,
      source: sourceRef.current,
    };

    if (!validateEmail(formData.email)) {
      setError('Invalid email address. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(
            `Too many contact attempts. Please try again in ${data.resetInMinutes} minutes.`
          );
        }
        throw new Error(`Failed to send Contact Form email.`);
      }

      if (data !== null) {
        setSubmitted(true);
        setError(null);
      }
    } catch (error) {
      console.log('Contact email error', error);
      setError('Failed to send your message. Please try again later');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mx-auto max-w-6xl p-2'>
      <h3 className='mb-6 text-lg'>all fields required</h3>
      {submitted ? (
        <div className='rounded-md bg-green-50 px-6 py-4 text-center'>
          <p className='font-medium text-green-600'>thanks for reaching out!</p>
          <p className='mt-1 text-sm text-green-600'>
            we&apos;ll give you a reply as soon as possible!
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-24 md:flex-row'>
          {/* Form Section */}
          <div className='flex-1'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <Label htmlFor='topic' className='text-xl'>
                  topic*
                </Label>
                <Input
                  type='text'
                  id='topic'
                  name='topic'
                  defaultValue=''
                  onChange={(e) => (topicRef.current = e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label htmlFor='name' className='text-xl'>
                  name + pronouns*
                </Label>
                <Input
                  type='text'
                  id='name'
                  name='name'
                  defaultValue=''
                  onChange={(e) => (nameRef.current = e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <Label htmlFor='email' className='text-xl'>
                  email*
                </Label>
                <Input
                  type='email'
                  id='email'
                  name='email'
                  defaultValue=''
                  onChange={(e) => (emailRef.current = e.target.value)}
                  disabled={isLoading}
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
                  defaultValue=''
                  onChange={(e) => (messageRef.current = e.target.value)}
                  disabled={isLoading}
                  required
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor='source' className='text-xl'>
                  where did you hear about Bikini Grad School?*
                </Label>
                <Select onValueChange={(e) => (sourceRef.current = e)}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Select a source' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sources</SelectLabel>
                      <SelectItem value='tiktok'>TikTok</SelectItem>
                      <SelectItem value='instagram'>Instagram</SelectItem>
                      <SelectItem value='family-friends'>
                        Family/Friends
                      </SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {error && <p className='mt-2 text-red-600'>{error}</p>}
              </div>

              <Button type='submit' size={'lg'} disabled={isLoading}>
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <svg
                      className='-ml-1 mr-3 h-5 w-5 animate-spin text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    processing...
                  </div>
                ) : (
                  'submit'
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
