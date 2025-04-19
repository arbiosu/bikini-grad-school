import Image from '@/components/Image';
import Grid from './Grid';
import { type Tables } from '@/lib/supabase/database';

export function IssuesCard({
  issue,
  index,
}: {
  issue: Tables<'issues'>;
  index: number;
}) {
  return (
    <div className='mx-auto text-center'>
      <Image
        baseUrl={issue.cover_image_path}
        alt={issue.title}
        className='mb-4'
        sizes='(max-width: 1920px) 320px'
      />
      <p className='text-xl'>
        <span className='text-indigo-300'>issue .0{index}</span> {issue.title}
      </p>
    </div>
  );
}

export default function IssuesGrid({ issues }: { issues: Tables<'issues'>[] }) {
  return (
    <Grid
      items={issues}
      renderItem={(issue, index) => (
        <IssuesCard issue={issue} index={index + 1} />
      )}
    />
  );
}
