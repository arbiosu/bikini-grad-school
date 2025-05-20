import Image from '@/components/Image';
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
    <Card className='flex flex-col border-none shadow-none'>
      <CardHeader className='relative'>
        <div className='flex items-center justify-center'>
          <Image baseUrl={imgUrl} alt={name} className='' sizes='320px' />
        </div>
      </CardHeader>
      <CardContent className='flex-grow p-4'>
        <div className='flex flex-col space-y-4'>
          <h3 className='text-center text-4xl font-medium'>{name}</h3>
          <p className={`text-center text-lg`}>
            {title}, <strong>{pronouns}</strong>
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
      variant={'medium'}
    />
  );
}
