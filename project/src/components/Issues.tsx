import Link from 'next/link';
import Image from '@/components/Image';
import Grid from './Grid';
import type {
  IssueContent,
  Photoshoot,
  Issue,
  ArticleWithContributorName,
} from '@/lib/supabase/model/types';
import { MONTH_NAMES } from '@/lib/supabase/model/constants';
import { IssueContentCard } from './IssueContent';

export function IssuePage({
  issue,
  issueArticles,
  issuePhotoshoots,
}: {
  issue: Issue;
  issueArticles: ArticleWithContributorName[];
  issuePhotoshoots: Photoshoot[];
}) {
  const date = issue.publication_date
    ? new Date(issue.publication_date)
    : new Date();

  const month = MONTH_NAMES[date.getMonth()].toLowerCase();
  const paddedIssueNum = issue.issue_number
    ? issue.description.padStart(4, '0.')
    : '';
  const contents: IssueContent[] = [
    ...issueArticles.map((a) => ({ kind: 'article' as const, payload: a })),
    ...issuePhotoshoots.map((p) => ({
      kind: 'photoshoot' as const,
      payload: p,
    })),
  ];

  return (
    <section>
      <div>
        <p className='mb-4 text-center text-lg'>
          {month} issue {paddedIssueNum}-{' '}
          <span className='font-bold'>{issue.title}</span>
        </p>
      </div>
      <div>
        <Grid
          items={contents}
          renderItem={(item) => <IssueContentCard item={item} />}
          variant={'large'}
        />
      </div>
    </section>
  );
}

export function IssuePageAlt({
  issue,
  issueArticles,
  issuePhotoshoots,
}: {
  issue: Issue;
  issueArticles: ArticleWithContributorName[];
  issuePhotoshoots: Photoshoot[];
}) {
  const date = issue.publication_date
    ? new Date(issue.publication_date)
    : new Date();

  const month = MONTH_NAMES[date.getMonth()].toLowerCase();
  const paddedIssueNum = issue.issue_number
    ? issue.description.padStart(4, '0.')
    : '';

  const contents: IssueContent[] = [
    ...issueArticles.map((a) => ({ kind: 'article' as const, payload: a })),
    ...issuePhotoshoots.map((p) => ({
      kind: 'photoshoot' as const,
      payload: p,
    })),
  ];

  return (
    <section className='container mx-auto px-4 py-8'>
      {/* Issue Header */}
      <div className='mb-8 text-center'>
        <h1 className='mb-2 text-3xl font-bold md:text-4xl'>
          {month} issue- {paddedIssueNum} {issue.title}
        </h1>
        <p className='text-lg text-gray-600'></p>
      </div>

      {/* Main Layout: Cover + Content Grid */}
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12'>
        {/* Cover Image Section */}
        <div className='flex flex-col justify-center'>
          <div className='group relative'>
            <div className='absolute inset-0 rotate-1 transform bg-gradient-to-br from-indigo-500/10 to-purple-500/10 transition-transform duration-300 group-hover:rotate-2'></div>
            <div className='relative overflow-hidden bg-white shadow-2xl'>
              <Image
                baseUrl={issue.cover_image_path}
                alt={`Cover Image for ${issue.title}`}
                className='h-auto w-full object-cover'
              />
            </div>
          </div>

          {/* Issue Info */}
          <div className='mt-6 text-center lg:text-left'>
            <div className='inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800'>
              {contents.length} {contents.length === 1 ? 'piece' : 'pieces'} in
              this issue
            </div>
          </div>
        </div>

        {/* Content Grid Section */}
        <div className='flex flex-col justify-center'>
          {contents.length > 0 ? (
            <div className='grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2'>
              {contents.map((item, index) => (
                <div
                  key={index}
                  className='transform transition-transform duration-200 hover:scale-105'
                >
                  <IssueContentCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className='flex h-64 items-center justify-center rounded-2xl bg-gray-50'>
              <p className='text-lg text-gray-500'>No content available yet</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function IssuesCard({ issue }: { issue: Issue }) {
  return (
    <Link href={`/past-issues/${issue.id}`}>
      <div className='mx-auto flex h-full flex-col items-center justify-center text-center transition-transform duration-300 ease-in-out hover:scale-110'>
        <Image
          baseUrl={issue.cover_image_path}
          alt={issue.title}
          className='mb-4'
        />
        <p className='text-base'>
          <span className='text-indigo-300'>issue {issue.description}</span>{' '}
          {issue.title}
        </p>
      </div>
    </Link>
  );
}

export default function IssuesGrid({ issues }: { issues: Issue[] }) {
  return (
    <Grid
      items={issues}
      renderItem={(issue) => <IssuesCard issue={issue} />}
      variant={'large'}
    />
  );
}
