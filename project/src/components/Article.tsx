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

      <div className='mx-auto mb-6 md:mb-8'>
        <Image
          baseUrl={article.img_path}
          alt={article.subtitle}
          className='w-full'
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
    <Link href={`/articles/${article.id}`} className='block h-full'>
      <div className='mx-auto flex h-full flex-col items-center justify-center text-center hover:underline'>
        <Image
          baseUrl={article.img_path}
          alt={`${article.title} by ${article.author}`}
          className='mx-auto mb-4 aspect-square max-w-lg object-cover p-2'
        />
        <p className='text-xl'>
          {article.title}{' '}
          <span className='text-indigo-300'>
            {article.contributorName.name}
          </span>
        </p>
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
