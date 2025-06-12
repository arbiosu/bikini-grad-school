import Image from '@/components/Image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Grid from '@/components/Grid';
import { cn } from '@/lib/utils';

interface StaffCardProps {
  imgUrl: string;
  name: string;
  pronouns: string;
  title: string;
}

export function StaffCard({ imgUrl, name, pronouns, title }: StaffCardProps) {
  return (
    <div className='group block'>
      <Card
        className={cn(
          'flex flex-col border-none shadow-none',
          'relative overflow-hidden',
          'transition-all duration-700 ease-out',
          'hover:rotate-1 group-hover:scale-[1.02]'
        )}
      >
        <div className='absolute inset-0 bg-gradient-to-t from-bgs-pink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
        <CardHeader className='relative p-2 pb-3'>
          <div className='flex items-center justify-center overflow-hidden rounded-lg'>
            <Image
              baseUrl={imgUrl}
              alt={name}
              className='h-auto w-full object-cover transition-transform'
            />
          </div>
          <div className='absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full' />
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
    </div>
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
