import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Image from '@/components/Image';
import Grid from '@/components/Grid';
import type {
  Article,
  ArticleWithContributorName,
  Contributor,
  Issue,
} from '@/lib/supabase/model/types';
import { ArticleChonkText } from './Chonk';
import { MONTH_NAMES } from '@/lib/supabase/model/constants';

export function Article({
  article,
  issue,
  contributor,
}: {
  article: Article;
  issue: Issue;
  contributor: Contributor;
}) {
  const issueDate = issue.publication_date
    ? new Date(issue.publication_date)
    : new Date();
  const month = MONTH_NAMES[issueDate.getMonth()].toLowerCase();
  const paddedIssueNum = issue.issue_number
    ? issue.issue_number.toString().padStart(4, '0.')
    : '';

  return (
    <div className='mx-auto max-w-4xl px-4 sm:px-6 md:px-8'>
      <div className='mb-4 pt-10'>
        <ArticleChonkText strings={[article.title]} variant={'medium'} />
      </div>
      <p className='mb-4 pt-10 text-center'>
        {month} issue {paddedIssueNum}-{' '}
        <span className='font-bold'>{issue.title} / </span>
        <span className='text-blue-300'>
          {contributor.name ? contributor.name : 'no contributor found :('}
        </span>
      </p>

      <div className='relative mx-auto mb-6 flex justify-center md:mb-8'>
        <Image
          baseUrl={article.img_path}
          alt={article.subtitle}
          className='w-full max-w-lg object-cover'
        />
      </div>

      <div id='content' className='space-y-4 md:space-y-5'>
        <div className='space-y-4'>
          <MarkdownRenderer content={article.content} />
        </div>
      </div>
    </div>
  );
}

export function ArticleCard({
  article,
}: {
  article: ArticleWithContributorName;
}) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className='block h-full'
      target='_blank'
      rel='noopener noreferrer'
    >
      <div className='mx-auto flex h-full flex-col text-center hover:underline'>
        <div className='relative mx-auto mb-4 aspect-square w-full max-w-lg'>
          <Image
            baseUrl={article.img_path}
            alt={`${article.title} by ${article.author}`}
            className='aspect-square h-full w-full object-contain p-2'
          />
        </div>

        <div className='flex flex-1 items-center justify-center px-2'>
          <p className='text-xl leading-tight'>
            <span className='mb-1 block'>
              {article.title}{' '}
              <span className='text-lg text-indigo-300'>
                {article.contributorName.name}
              </span>
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function ArticlesGrid({
  articles,
}: {
  articles: ArticleWithContributorName[];
}) {
  return (
    <Grid
      items={articles}
      renderItem={(article) => <ArticleCard article={article} />}
      variant={'large'}
    />
  );
}
