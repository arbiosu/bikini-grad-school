import ContactForm from '@/components/Contact';
import TextBlock from '@/components/TextBlock';
import { ChonkText } from '@/components/Chonk';

export default function Page() {
  return (
    <main className='mx-auto'>
      <div className='pt-20'>
        <ChonkText strings={['GET', 'INVOLVED']} variant='large' />
        <TextBlock
          heading='We accept photo, art, and writing contributions.'
          subheading='Pitch us your idea and a sample of some of your past work and we’ll get back to you :)'
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
