import Image from '@/components/Image';
import BGSstar from './BGSstar';

export default function About() {
  return (
    <section className='mx-auto p-36 pt-12'>
      <div className='absolute right-8'>
        <BGSstar />
      </div>
      <div className='grid items-center lg:grid-cols-2'>
        <div className='container relative mx-auto'>
          <Image
            baseUrl='/content/bgs-jk'
            alt='Kelly Slater (right) and Jayne Breakfast (left)'
            sizes='960px'
            className='object-contain'
          />
        </div>
        <div>
          <div className='space-y-6'>
            <h1 className='border-b-2 border-bgs-pink text-center text-4xl tracking-wider md:text-left md:text-5xl'>
              about
            </h1>
            <p className='text-left text-xl leading-relaxed'>
              Bikini Grad School is a magazine and art community.
            </p>
            <p className='text-xl font-medium leading-relaxed'>
              Bikini Grad School was born out of a want for connection in adult
              life and the mag works to build community through creative
              conversations, in-person events and a monthly newsletter, someday
              to be a physical publication.
            </p>
            <p className='text-xl leading-relaxed'>
              The big gorgeous brains behind BGS are Kelly Slater and Jayne
              Breakfast.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
