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
          heading='we accept photo, art, and writing contributions.'
          subheading='pitch us your idea and we’ll get back to you :)'
          headingSize='xsmall'
          subheadingSize='small'
        />
        <div className='container mx-auto flex justify-center'>
          <Image
            baseUrl='/content/get-involved-new-bg'
            alt='Background image'
            sizes='960px'
            widths={['960']}
            className='mb-12'
          />
        </div>
      </div>
      <div className='container mx-auto'>
        <ContactForm />
      </div>
    </main>
  );
}
