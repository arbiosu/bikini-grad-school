'use client';

import { useState } from 'react';
import { Button } from '@/components/Buttons';
import { addContributeMessage } from '@/app/contribute/actions';

export default function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(email);
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      alert('Invalid email address. Please try again.');
      setError('Invalid email address. Please try again.');
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);

    await addContributeMessage(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {error && <p className='text-red-500'>{error}</p>}
      <div>
        <label
          htmlFor='email'
          className='mb-2 block text-lg font-bold text-custom-pink-text'
        >
          Email
        </label>
        <input
          type='email'
          id='email'
          className='focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-lg text-custom-pink-text shadow-sm'
          placeholder='name@example.com'
          value={email}
          onChange={(e) => setEmail(() => e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor='subject'
          className='mb-2 block text-lg font-bold text-custom-pink-text'
        >
          Subject
        </label>
        <input
          type='text'
          id='subject'
          className='focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-lg text-gray-900 shadow-sm'
          placeholder='Tell us whats on your mind'
          value={subject}
          onChange={(e) => setSubject(() => e.target.value)}
          required
        />
      </div>
      <div className='sm:col-span-2'>
        <label
          htmlFor='message'
          className='mb-2 block text-lg font-bold text-custom-pink-text'
        >
          Your message
        </label>
        <textarea
          id='message'
          rows={6}
          className='focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-lg text-gray-900 shadow-sm'
          placeholder='Leave a comment'
          value={message}
          onChange={(e) => setMessage(() => e.target.value)}
          required
        ></textarea>
      </div>
      <Button label={'Send Message'} />
    </form>
  );
}
