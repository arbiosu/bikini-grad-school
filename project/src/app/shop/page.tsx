import { ChonkText } from '@/components/Chonk';
import SubscribeCard from '@/components/Subscribe';

export default function Page() {
  return (
    <main className='mx-auto py-20'>
      <ChonkText strings={['COMING', 'SOON']} />
      <div className='container mx-auto max-w-2xl'>
        <SubscribeCard />
      </div>
    </main>
  );
}
