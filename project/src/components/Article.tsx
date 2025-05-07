import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Image from '@/components/Image';
import Grid from '@/components/Grid';
import TextBlock from '@/components/TextBlock';
import { type Tables } from '@/lib/supabase/database';

export function Article({ article }: { article: Tables<'articles'> }) {
  return (
    <div className='mx-auto max-w-4xl px-4 sm:px-6 md:px-8'>
      <div className=''>
        <TextBlock
          heading={article.title}
          subheading={`by ${article.author}`}
        />
      </div>

      <div className='mx-auto mb-6 md:mb-8'>
        <Image
          baseUrl={article.img_path}
          alt={article.subtitle}
          className='w-full'
        />
      </div>

      <div id='content' className='space-y-4 md:space-y-5'>
        <p className='text-lg md:text-xl'>{article.subtitle}</p>

        <div className='space-y-4'>
          <MarkdownRenderer content={article.content} />
        </div>
      </div>
    </div>
  );
}

export function ArticleCard({ article }: { article: Tables<'articles'> }) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className='mx-auto text-center hover:underline'>
        <Image
          baseUrl={article.img_path}
          alt={`${article.title} by ${article.author}`}
          className='mb-4'
          widths={['320', '640']}
          sizes='640px'
        />
        <p className='text-xl'>
          {article.title}{' '}
          <span className='text-indigo-300'>{article.author}</span>
        </p>
      </div>
    </Link>
  );
}

export default function ArticlesGrid({
  articles,
}: {
  articles: Tables<'articles'>[];
}) {
  return (
    <Grid
      items={articles}
      renderItem={(article) => <ArticleCard article={article} />}
    />
  );
}
