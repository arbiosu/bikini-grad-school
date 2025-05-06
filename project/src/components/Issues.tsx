import Link from 'next/link';
import Image from '@/components/Image';
import Grid from './Grid';
import { type Tables } from '@/lib/supabase/database';
import ArticlesGrid from './Article';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function Issue({
  issue,
  issueArticles,
}: {
  issue: Tables<'issues'>;
  issueArticles: Tables<'articles'>[];
}) {
  const date = issue.publication_date
    ? new Date(issue.publication_date)
    : new Date();

  const month = monthNames[date.getMonth()].toLowerCase();

  return (
    <section>
      <div>
        <p className='mb-4 text-center text-lg'>
          {month} issue - {issue.title}
        </p>
      </div>
      <div className='p-10'>
        <ArticlesGrid articles={issueArticles} />
      </div>
    </section>
  );
}

export function IssuesCard({
  issue,
  index,
  totalCount,
}: {
  issue: Tables<'issues'>;
  index: number;
  totalCount: number;
}) {
  return (
    <Link href={`/past-issues/${issue.id}`}>
      <div className='mx-auto text-center transition-transform duration-500 ease-in-out hover:scale-105'>
        <Image
          baseUrl={issue.cover_image_path}
          alt={issue.title}
          className='mb-4'
          widths={['320', '640']}
          sizes='320px'
        />
        <p className='text-base'>
          <span className='text-indigo-300'>issue .0{totalCount - index}</span>{' '}
          {issue.title}
        </p>
      </div>
    </Link>
  );
}

export default function IssuesGrid({ issues }: { issues: Tables<'issues'>[] }) {
  return (
    <Grid
      items={issues}
      renderItem={(issue, index) => (
        <IssuesCard issue={issue} index={index} totalCount={issues.length} />
      )}
      variant={'large'}
    />
  );
}
