import ContactForm from '@/components/Contact';
import TextBlock from '@/components/TextBlock';
import { ChonkText } from '@/components/Chonk';
import Image from '@/components/Image';

export default function Page() {
  return (
    <main className='relative mx-auto'>
      <div className='absolute inset-0 -z-10 h-full w-full overflow-hidden'>
        <Image
          baseUrl='/content/get-involved-bg'
          className='h-full w-full object-cover'
          alt='Background image'
        />
      </div>
      <div className='relative pt-20'>
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
