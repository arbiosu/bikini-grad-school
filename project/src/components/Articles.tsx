import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Buttons';
import type { Tables } from '@/lib/supabase/database';

interface ArticleProps {
  article: Tables<'articles'>;
}

export function ArticlePreview({ article }: ArticleProps) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/images/${article.img_path}`;

  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-md'>
      <div className='relative w-full pt-[56.25%]'>
        <Image
          src={url || '/placeholder.svg'}
          alt={article.title}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover'
        />
      </div>

      <div className='p-6'>
        <h2 className='mb-2 text-4xl font-bold text-custom-pink-text'>
          {article.title}
        </h2>
        <p className='mb-4 text-xl text-black'>
          By {article.author} |{' '}
          {new Date(article.created_at).toLocaleDateString()}
        </p>
        <p className='mb-4 text-lg text-gray-900'>{article.excerpt}</p>
        <Link href={`/articles/${article.id}`}>
          <Button label={'Read More'} />
        </Link>
      </div>
    </div>
  );
}

export function Article({ article }: ArticleProps) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/images/${article.img_path}`;

  return (
    <article className='mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-md'>
      <Image
        src={url || '/placeholder.svg'}
        alt={article.title}
        width={800}
        height={400}
      />
      <div className='p-8'>
        <h1 className='mb-4 text-4xl font-bold text-custom-pink-text'>
          {article.title}
        </h1>
        <p className='mb-6 text-gray-600'>
          By {article.author} |{' '}
          {new Date(article.created_at).toLocaleDateString()}
        </p>
        <div className='prose prose-pink max-w-none'>
          {article.content.split('\n').map((line, index) => (
            <p key={index} className='mb-4 text-black'>
              {line}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
