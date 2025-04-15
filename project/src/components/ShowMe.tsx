import Image from './Image';
import Grid from './Grid';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ShowMeProps {
  label: string;
  imgUrl: string;
}

function ShowMeCard({ label, imgUrl }: ShowMeProps) {
  return (
    <Card className='mx-auto flex h-full flex-col border-none shadow-none transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
      <CardContent className='flex flex-grow items-center justify-center p-6 pb-0'>
        <div className='relative flex aspect-square w-full items-center justify-center overflow-hidden'>
          <Image
            baseUrl={imgUrl}
            alt={label}
            className='h-full w-full object-contain'
            sizes='320px'
            widths={['320', '640']}
          />
        </div>
      </CardContent>
      <CardFooter className='mt-auto'>
        <h3 className='w-full text-center text-xl'>{label}</h3>
      </CardFooter>
    </Card>
  );
}

export default function ShowMeGrid({ cards }: { cards: ShowMeProps[] }) {
  return <Grid items={cards} renderItem={(card) => <ShowMeCard {...card} />} />;
}
