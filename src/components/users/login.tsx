'use client';

import { useState } from 'react';
import { loginAction } from '@/actions/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await loginAction(email, password);

    // If we get here, login failed — successful login redirects server-side
    if (!result.success) {
      setError(result.error.message);
    }

    setIsLoading(false);
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8'>
        <h1 className='mb-1 text-2xl font-bold text-gray-900'>Log in</h1>
        <p className='mb-6 text-sm text-gray-500'>
          Access your subscription and account
        </p>

        {error && (
          <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none'
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none'
            />
          </div>
          <button
            type='submit'
            disabled={isLoading}
            className='w-full rounded-lg bg-gray-900 py-2.5 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
