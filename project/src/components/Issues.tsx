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
      <div className='p-10'>
        <Grid
          items={contents}
          renderItem={(item) => <IssueContentCard item={item} />}
          variant={'large'}
        />
      </div>
    </section>
  );
}

export function IssuesCard({ issue }: { issue: Issue }) {
  return (
    <Link href={`/past-issues/${issue.id}`}>
      <div className='mx-auto flex h-full flex-col items-center justify-center text-center transition-transform duration-500 ease-in-out hover:scale-105'>
        <Image
          baseUrl={issue.cover_image_path}
          alt={issue.title}
          className='mb-4'
          widths={['960']}
          sizes='960px'
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
