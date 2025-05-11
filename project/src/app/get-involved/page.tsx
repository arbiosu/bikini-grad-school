import ContactForm from '@/components/Contact';
import TextBlock from '@/components/TextBlock';
import { ChonkText } from '@/components/Chonk';
import Image from '@/components/Image';

export default function Page() {
  return (
    <main className='relative mx-auto'>
      <div className='relative pt-20'>
        <ChonkText strings={['GET', 'INVOLVED']} variant='large' />
        <TextBlock
          heading='We accept photo, art, and writing contributions.'
          subheading='Pitch us your idea and we’ll get back to you :)'
          headingSize='xsmall'
          subheadingSize='small'
        />
        <div className='container mx-auto grid gap-4 p-10 md:grid-cols-2'>
          <Image
            baseUrl='/content/get-involved-new-bg'
            alt='Background image'
            sizes='640px'
          />
          <Image
            baseUrl='/content/get-involved-bg'
            alt='Background image'
            sizes='640px'
          />
        </div>
      </div>
      <div className='container mx-auto'>
        <ContactForm />
      </div>
    </main>
  );
}
