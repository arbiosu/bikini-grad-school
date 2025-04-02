import Image from '@/components/Image';
import { specialElite } from '../../public/fonts/fonts';
import Grid from '@/components/Grid';

interface IssuesCardProps {
  imgUrl: string;
  issue: string;
}

export function IssuesCard({ imgUrl, issue }: IssuesCardProps) {
  return (
    <div className={`${specialElite.className} text-center`}>
      <Image baseUrl={imgUrl} alt={issue} className='mb-4 w-full' />
      <p className='text-xl'>{issue}</p>
    </div>
  );
}

export default function IssuesGrid({ issues }: { issues: IssuesCardProps[] }) {
  return (
    <Grid items={issues} renderItem={(issue) => <IssuesCard {...issue} />} />
  );
}
