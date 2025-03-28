import ContactForm from '@/components/Contact';

export default function Page() {
  return (
    <div className='mx-auto max-w-screen-md px-4'>
      <div className='p-6'>
        <h2 className='mb-4 text-center text-5xl font-bold tracking-tight text-custom-pink-text'>
          Contribute
        </h2>
        <p className='mb-8 text-center text-2xl text-custom-pink-text lg:mb-16'>
          Get in touch
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
