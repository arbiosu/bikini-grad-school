'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useState } from 'react';

export default function SubscribeCard() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address. Thank you!');
      return;
    }

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!re.test(email)) {
      setError('Invalid email address. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        if (res.status === 429) {
          setError(
            `too many subscription attempts. please try again in ${data.resetInMinutes} minutes.`
          );
        }
        throw new Error(`Failed to send email`);
      }
      if (data !== null) {
        setSubmitted(true);
        setError(null);
      }
    } catch (error) {
      console.log('Email error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Card className='font-main mb-8 border-none p-8 shadow-none'>
        <CardHeader>
          <CardTitle className='text-4xl'>Subscribe</CardTitle>
          <CardDescription className='text-lg'>
            Get instant updates on all things Bikini Grad School.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className='rounded-md bg-green-50 px-6 py-4 text-center'>
              <p className='font-medium text-green-600'>
                thanks for subscribing!
              </p>
              <p className='mt-1 text-sm text-green-600'>
                we&apos;ll keep you updated with the latest news
              </p>
            </div>
          ) : (
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='name'
                  placeholder='name@example.com'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(() => e.target.value);
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
              {error && <p className='text-rose-600'>{error}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter className=''>
          <Button
            type='submit'
            disabled={isLoading}
            className='font-main bg-alt-pink border border-black font-bold text-black'
          >
            {isLoading ? (
              <div className='flex items-center'>
                <svg
                  className='mr-3 -ml-1 h-5 w-5 animate-spin text-white'
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
              'Subscribe Now'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
