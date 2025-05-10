import Link from 'next/link';
import Image from '@/components/Image';
import Grid from './Grid';
import { type Tables } from '@/lib/supabase/database';
import ArticlesGrid from './Article';
import PhotoshootGrid from './Photoshoots';

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
  issuePhotoshoots,
}: {
  issue: Tables<'issues'>;
  issueArticles: Tables<'articles'>[];
  issuePhotoshoots: Tables<'photoshoots'>[];
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
      <div className='p-10'>
        <PhotoshootGrid photoshoots={issuePhotoshoots} />
      </div>
    </section>
  );
}

export function IssuesCard({ issue }: { issue: Tables<'issues'> }) {
  return (
    <Link href={`/past-issues/${issue.id}`}>
      <div className='mx-auto flex h-full flex-col items-center justify-center text-center transition-transform duration-500 ease-in-out hover:scale-105'>
        <Image
          baseUrl={issue.cover_image_path}
          alt={issue.title}
          className='mb-4'
          widths={['320']}
          sizes='320px'
        />
        <p className='text-base'>
          <span className='text-indigo-300'>issue .0{issue.issue_number}</span>{' '}
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
      renderItem={(issue) => <IssuesCard issue={issue} />}
      variant={'large'}
    />
  );
}
