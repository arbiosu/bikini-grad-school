import Image from '@/components/Image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Grid from '@/components/Grid'; // Assuming Grid component handles layout

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
          <Image
            baseUrl={imgUrl}
            alt={name}
            className=''
            sizes="(max-width: 1920px) 320px"
          />
        </div>
      </CardHeader>
      <CardContent className='flex-grow p-4'>
        <div className='flex flex-col space-y-4'>
          <h3 className='text-center text-4xl font-medium'>{name}</h3>
          <p className='text-center text-xl text-muted-foreground'>
            {pronouns}
          </p>
          <p className={`text-center text-lg`}>
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