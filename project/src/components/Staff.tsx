import Image from 'next/image';
import { specialElite } from '../../public/fonts/fonts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Grid from '@/components/Grid';

interface StaffCardProps {
  imgUrl: string;
  name: string;
  pronouns: string;
  title: string;
}

export function StaffCard({ imgUrl, name, pronouns, title }: StaffCardProps) {
  return (
    <Card className='flex flex-col'>
      <CardHeader className='relative max-h-[300px] p-0 pt-[100%]'>
        <div className='absolute inset-0 h-full w-full'>
          <Image
            src={imgUrl}
            alt={name}
            fill
            className='rounded-t-lg object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px'
          />
        </div>
      </CardHeader>
      <CardContent className='flex-grow p-4'>
        <div className='flex flex-col'>
          <h3 className='text-center text-4xl font-medium'>{name}</h3>
          <p className='text-center text-xl text-muted-foreground'>
            {pronouns}
          </p>
          <p className={`${specialElite.className} text-center text-lg`}>
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StaffGrid({
  staffMembers,
}: {
  staffMembers: StaffCardProps[];
}) {
  return (
    <Grid
      items={staffMembers}
      renderItem={(staff) => <StaffCard {...staff} />}
    />
  );
}
