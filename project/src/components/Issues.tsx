import Image from '@/components/Image';
import Grid from './Grid';

interface IssuesCardProps {
  imgUrl: string;
  issue: string;
  index: number;
}

export function IssuesCard({ imgUrl, issue, index }: IssuesCardProps) {
  return (
    <div className={`mx-auto text-center`}>
      <Image
        baseUrl={imgUrl}
        alt={issue}
        className='mb-4'
        sizes='(max-width: 1920px) 320px'
      />
      <p className='text-xl'>
        <span className='text-indigo-300'>issue .0{index}</span> {issue}
      </p>
    </div>
  );
}

export default function IssuesGrid({ issues }: { issues: IssuesCardProps[] }) {
  return (
    <Grid items={issues} renderItem={(issue) => <IssuesCard {...issue} />} />
  );
}
