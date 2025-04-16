import { ChonkText } from '@/components/Chonk';
import SubscribeCard from '@/components/Subscribe';
import TextBlock from '@/components/TextBlock';

export default function Page() {
  return (
    <section className='mx-auto pt-10'>
      <ChonkText strings={['COMING', 'SOON']} />
      <div>
        <TextBlock
          heading='under construction'
          subheading='subscribe for updates'
          headingSize='medium'
        />
      </div>
      <div className='container mx-auto max-w-2xl'>
        <SubscribeCard />
      </div>
    </section>
  );
}
