'use client';

import { useState } from 'react';
import { login } from '@/app/admin/login/actions';
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await login(formData);
    setLoading(false);
  }

  return (
    <div className='py-20'>
      <form action={handleSubmit} className='space-y-4'>
        <div className='mx-auto max-w-screen-md px-4 py-8 lg:py-16'>
          <label className='mb-2 block text-lg font-bold' htmlFor='email'>
            Email:
          </label>
          <input
            id='email'
            name='email'
            type='email'
            className='focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-2xl text-custom-pink-text shadow-sm'
            required
          />

          <label className='mb-2 block text-lg font-bold' htmlFor='password'>
            Password:
          </label>
          <input
            id='password'
            name='password'
            type='password'
            className='focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-2xl text-custom-pink-text shadow-sm'
            required
          />
          <div className='py-4'>
            <Button>{loading ? 'Logging in...' : 'Log in'}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
