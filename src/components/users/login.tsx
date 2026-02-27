'use client';

import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { loginAction, generateNewMagicLinkAction } from '@/actions/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showClaimSection, setShowClaimSection] = useState(false);
  const [claimEmail, setClaimEmail] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimStatus, setClaimStatus] = useState<
    'idle' | 'loading' | 'sent' | 'cooldown'
  >('idle');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await loginAction(email, password);
    if (!result.success) {
      setError(result.error.message);
    }
    setIsLoading(false);
  }

  async function handleSendClaimLink() {
    setClaimError('');
    setClaimStatus('loading');
    const result = await generateNewMagicLinkAction(claimEmail);
    if (!result.success) {
      setClaimError(result.error.message);
      setClaimStatus(
        result.error.code === 'RATE_LIMITED' ? 'cooldown' : 'idle'
      );
      return;
    }
    setClaimStatus('sent');
  }

  return (
    <div className='font-main flex min-h-screen items-center justify-center px-4'>
      <div className='bg-alt-pink w-full max-w-sm rounded-xl border border-gray-200 p-4'>
        <h1 className='mb-1 text-2xl font-bold text-gray-900'>Log in</h1>
        <p className='mb-6 text-sm text-black'>
          Access your subscription and account
        </p>

        {error && (
          <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <Label className='mb-1 block text-sm font-medium text-gray-700'>
              Email
            </Label>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full rounded-lg border border-black px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none'
            />
          </div>
          <div>
            <Label className='mb-1 block text-sm font-medium text-gray-700'>
              Password
            </Label>
            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full rounded-lg border border-black px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none'
            />
          </div>
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full rounded-lg bg-gray-900 py-2.5 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        <div className='mt-6 border-t border-gray-200 pt-4'>
          {!showClaimSection ? (
            <Button
              type='button'
              onClick={() => setShowClaimSection(true)}
              className='w-full text-center text-sm text-black'
            >
              Never received your account setup email?
            </Button>
          ) : (
            <div className='space-y-3'>
              <p className='text-sm text-gray-600'>
                Enter your email and we'll send a new setup link.
              </p>

              {claimError && (
                <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
                  {claimError}
                </div>
              )}

              {claimStatus === 'sent' ? (
                <div className='rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700'>
                  Check your inbox — we sent a new setup link.
                </div>
              ) : (
                <>
                  <Input
                    type='email'
                    value={claimEmail}
                    onChange={(e) => setClaimEmail(e.target.value)}
                    placeholder='you@example.com'
                    className='w-full rounded-lg border border-black px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none'
                  />
                  <Button
                    type='button'
                    onClick={handleSendClaimLink}
                    disabled={
                      !claimEmail ||
                      claimStatus === 'loading' ||
                      claimStatus === 'cooldown'
                    }
                    className='w-full rounded-lg border border-gray-900 bg-transparent py-2.5 font-medium text-gray-900 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {claimStatus === 'loading'
                      ? 'Sending...'
                      : 'Send setup link'}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
