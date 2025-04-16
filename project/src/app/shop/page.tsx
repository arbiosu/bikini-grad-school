import { ChonkText } from '@/components/Chonk';
import SubscribeCard from '@/components/Subscribe';

export default function Page() {
  return (
    <section className='mx-auto'>
      <div className='pt-20'>
        <ChonkText strings={['COMING', 'SOON']} />
      </div>
      <div className='container mx-auto max-w-xl'>
        <SubscribeCard />
      </div>
    </section>
  );
}
