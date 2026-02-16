'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/clients/client';

type PageState = 'loading' | 'set-password' | 'success' | 'error';

export default function ClaimAccountPage() {
  const [state, setState] = useState<PageState>('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function handleTokenExchange() {
      // Supabase redirects here with tokens in the hash fragment
      // #access_token=xxx&refresh_token=xxx&type=magiclink
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      // Clean tokens out of the URL
      window.history.replaceState(null, '', '/claim-account');

      if (!accessToken || !refreshToken) {
        setState('error');
        setError('Invalid or expired link. Please request a new one.');
        return;
      }

      // Set the session using the tokens — this validates them with Supabase
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        setState('error');
        setError('Invalid or expired link. Please request a new one.');
        return;
      }

      // Verify the user server-side
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setState('error');
        setError(
          'Could not verify your identity. Please request a new link by emailing us.'
        );
        return;
      }

      setState('set-password');
    }

    handleTokenExchange();
  }, []);

  async function handleSetPassword() {
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    setState('success');
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8'>
        {state === 'loading' && (
          <div className='text-center'>
            <div className='mb-4 inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900' />
            <p className='text-gray-600'>Verifying your link...</p>
          </div>
        )}

        {state === 'set-password' && (
          <>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>
              Set your password
            </h1>
            <p className='mb-6 text-gray-600'>
              Create a password to finish setting up your account.
            </p>

            {error && (
              <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
                {error}
              </div>
            )}

            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Password
                </label>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='At least 8 characters'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Confirm password
                </label>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm your password'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none'
                />
              </div>
              <button
                onClick={handleSetPassword}
                disabled={isSubmitting}
                className='w-full rounded-lg bg-gray-900 py-2.5 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isSubmitting ? 'Setting up...' : 'Create account'}
              </button>
            </div>
          </>
        )}

        {state === 'success' && (
          <div className='text-center'>
            <div className='mb-4 text-4xl'>✅</div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>
              You're all set!
            </h1>
            <p className='mb-6 text-gray-600'>
              Your account is ready. You can now log in anytime.
            </p>
            <a
              href='/'
              className='inline-block rounded-lg bg-gray-900 px-6 py-2.5 font-medium text-white transition-colors hover:bg-gray-800'
            >
              Go to homepage
            </a>
          </div>
        )}

        {state === 'error' && (
          <div className='text-center'>
            <div className='mb-4 text-4xl'>😕</div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>
              Something went wrong
            </h1>
            <p className='mb-6 text-gray-600'>{error}</p>
            <a
              href='/'
              className='inline-block rounded-lg bg-gray-900 px-6 py-2.5 font-medium text-white transition-colors hover:bg-gray-800'
            >
              Go to homepage
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
