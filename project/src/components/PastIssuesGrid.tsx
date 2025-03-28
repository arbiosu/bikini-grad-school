import Image from 'next/image';
import { specialElite } from '../../public/fonts/fonts';
import Grid from '@/components/Grid';

interface IssuesCardProps {
  imgUrl: string;
  issue: string;
}

export function IssuesCard({ imgUrl, issue }: IssuesCardProps) {
  return (
    <div className={`${specialElite.className} text-center`}>
      <Image
        src={imgUrl}
        alt={issue}
        width={600}
        height={400}
        priority
        className='mb-4'
      />
      <p className='text-xl'>{issue}</p>
    </div>
  );
}

export default function IssuesGrid({ issues }: { issues: IssuesCardProps[] }) {
  return (
    <Grid items={issues} renderItem={(issue) => <IssuesCard {...issue} />} />
  );
}
