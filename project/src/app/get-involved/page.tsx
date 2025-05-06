import ContactForm from '@/components/Contact';
import TextBlock from '@/components/TextBlock';
import { ChonkText } from '@/components/Chonk';
import Image from '@/components/Image';

export default function Page() {
  return (
    <main className='mx-auto'>
      <div className='absolute inset-0 h-full w-full overflow-hidden'>
        <Image
          baseUrl='/content/bgs-4'
          className='h-full w-full object-cover'
          alt='Background image'
        />
      </div>
      <div className='pt-20'>
        <ChonkText strings={['GET', 'INVOLVED']} variant='large' />
        <TextBlock
          heading='We accept photo, art, and writing contributions.'
          subheading='Pitch us your idea and we’ll get back to you :)'
          headingSize='xsmall'
          subheadingSize='small'
        />
      </div>
      <div className='container mx-auto'>
        <ContactForm />
      </div>
    </main>
  );
}
