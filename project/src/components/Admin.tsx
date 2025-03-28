'use client';

import { useState, useRef } from 'react';
import { Pencil, Trash2, LogOut } from 'lucide-react';
import type { Tables } from '@/lib/supabase/database';
import { login } from '@/app/admin/login/actions';
import {
  createArticle,
  editArticle,
  deleteArticle,
} from '@/lib/supabase/model';
import { Button } from '@/components/Buttons';
import Link from 'next/link';
import Image from 'next/image';

interface ArticleItemProps {
  article: Tables<'articles'>;
}

interface ContributeMessageProps {
  message: Tables<'contribute'>;
}

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
          <label
            className='mb-2 block text-lg font-bold text-custom-pink-text'
            htmlFor='email'
          >
            Email:
          </label>
          <input
            id='email'
            name='email'
            type='email'
            className='focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-2xl text-custom-pink-text shadow-sm'
            required
          />

          <label
            className='mb-2 block text-lg font-bold text-custom-pink-text'
            htmlFor='password'
          >
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
            <Button label={loading ? 'Logging in...' : 'Log in'} />
          </div>
        </div>
      </form>
    </div>
  );
}

export function SignOutForm() {
  return (
    <form action='/admin/signout' method='post'>
      <Button
        label={
          <div>
            <LogOut />
            {'Log Out'}
          </div>
        }
      />
    </form>
  );
}

export function ArticleItem({ article }: ArticleItemProps) {
  const handleDelete = async () => {
    // Implement delete functionality
    const { error } = await deleteArticle(article.id);
    if (error) {
      console.error('Error deleting article:', error);
    }
    console.log(`Delete post with id: ${article.id}`);
    alert(
      'Article deleted successfully! Refresh the page (TODO: implement revalidation)'
    );
  };
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/images/${article.img_path}`;

  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-md'>
      <div className='flex items-center border-b p-4'>
        <Image
          src={url || '/placeholder.svg'}
          alt={article.title}
          width={80}
          height={80}
          className='mr-4 rounded-md object-cover'
        />
        <div className='flex-grow'>
          <h2 className='truncate text-lg font-semibold text-gray-800'>
            {article.title}
          </h2>
          <p className='text-sm text-gray-600'>
            By {article.author} |{' '}
            {new Date(article.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className='p-4'>
        <p className='mb-4 line-clamp-2 text-sm text-gray-700'>
          {article.excerpt}
        </p>
        <div className='flex items-center justify-between'>
          <div className='flex space-x-2'>
            <Link href={`/admin/edit/${article.id}`}>
              <button className='rounded p-2 text-green-600 hover:bg-green-100'>
                <Pencil className='h-5 w-5' />
              </button>
            </Link>
            <button
              onClick={handleDelete}
              className='rounded p-2 text-red-900 hover:bg-green-100'
            >
              <Trash2 className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UploadArticle() {
  const [article, setArticle] = useState({
    title: '',
    author: '',
    excerpt: '',
    content: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload an image');
      return;
    }

    setLoading(true);

    try {
      const newArticle = await createArticle(article, file);

      if (newArticle) {
        alert('Article created successfully!');
        setArticle({ title: '', author: '', excerpt: '', content: '' });
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      alert('Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md'>
      <h2 className='mb-4 text-2xl font-semibold text-custom-pink-text'>
        Upload an Article - all fields are required
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <label className='mb-2 block text-lg font-bold text-black'>
          Title of the Article*
        </label>
        <input
          type='text'
          name='title'
          placeholder='Title'
          value={article.title}
          onChange={handleChange}
          className='w-full rounded border p-2 text-black'
          required
        />
        <label className='mb-2 block text-lg font-bold text-black'>
          Author of the Article*
        </label>
        <input
          type='text'
          name='author'
          placeholder='Author'
          value={article.author}
          onChange={handleChange}
          className='w-full rounded border p-2 text-black'
          required
        />
        <label className='mb-2 block text-lg font-bold text-black'>
          Excerpt* - a brief description of the article for article previews
        </label>
        <textarea
          name='excerpt'
          placeholder='Excerpt'
          value={article.excerpt}
          onChange={handleChange}
          className='w-full rounded border p-2 text-black'
          required
        />
        <label className='mb-2 block text-lg font-bold text-black'>
          Content* - please use 2 line breaks when separating paragraphs
        </label>
        <textarea
          name='content'
          placeholder='Content'
          value={article.content}
          onChange={handleChange}
          className='h-32 w-full rounded border p-2 text-black'
          required
        />
        <label className='mb-2 block text-lg font-bold text-black'>
          Image upload* - keep filenames unique
        </label>
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          ref={fileInputRef}
          className='w-full rounded border p-2 text-black'
          required
        />
        <button
          type='submit'
          className='w-full rounded bg-blue-500 p-2 font-bold text-white'
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Submit Article'}
        </button>
      </form>
    </div>
  );
}

export function EditArticleForm({ article }: ArticleItemProps) {
  const [data, setData] = useState({
    id: article.id,
    title: article.title,
    author: article.author,
    excerpt: article.excerpt,
    content: article.content,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedArticle = await editArticle(data);
      if (updatedArticle) {
        alert('Article updated successfully!');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article');
    }
  };

  return (
    <div className='mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md'>
      <h1 className='mb-4 text-2xl font-semibold text-custom-pink-text'>
        Edit Article
      </h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <label className='mb-2 block text-lg font-bold text-black'>Title</label>
        <input
          className='w-full rounded border p-2 text-black'
          type='text'
          name='title'
          value={data.title}
          onChange={handleChange}
        />
        <label className='mb-2 block text-lg font-bold text-black'>
          Author
        </label>
        <input
          className='w-full rounded border p-2 text-black'
          type='text'
          name='author'
          value={data.author}
          onChange={handleChange}
        />
        <label className='mb-2 block text-lg font-bold text-black'>
          Excerpt
        </label>
        <textarea
          className='w-full rounded border p-2 text-black'
          name='excerpt'
          value={data.excerpt}
          onChange={handleChange}
        />
        <label className='mb-2 block text-lg font-bold text-black'>
          Content
        </label>
        <textarea
          className='w-full rounded border p-2 text-black'
          name='content'
          value={data.content}
          onChange={handleChange}
        />
        <button
          type='submit'
          className='w-full rounded bg-blue-500 p-2 font-bold text-white'
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export function ContributeMessage({ message }: ContributeMessageProps) {
  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-md'>
      <div className='p-6'>
        <h2 className='mb-2 text-4xl font-bold text-custom-pink-text'>
          SUBJECT: {message.subject}
        </h2>
        <p className='mb-6 text-gray-600'>From {message.email}</p>
        <p className='mb-6 text-gray-600'>{message.message}</p>
        <p className='mb-6 text-gray-600'>
          Message sent on {new Date(message.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export function ContributeMessageItem({ message }: ContributeMessageProps) {
  return <ContributeMessage message={message} />;
}
