import Image from '@/components/Image';
import { specialElite } from '../../public/fonts/fonts';

export default function About() {
  return (
    <section className='mx-auto px-12 pt-16'>
      <div className='grid items-center gap-2 md:grid-cols-2'>
        <div className='container relative mx-auto'>
          <Image
            baseUrl='/content/bgs-jk'
            alt='Kelly Slater (right) and Jayne Breakfast (left)'
            className=''
          />
        </div>
        <div className=''>
          <div className={`${specialElite.className} space-y-6`}>
            <h1 className='border-b-2 border-bgs-pink text-center text-4xl tracking-wider md:text-left md:text-5xl'>
              about
            </h1>
            <p className='text-left text-2xl leading-relaxed'>
              Bikini Grad School is a magazine and art community.
            </p>
            <p className='text-xl font-medium leading-relaxed'>
              Bikini Grad School was born out of a want for connection in adult
              life and the mag works to build community through creative
              conversations, in-person events and a monthly newsletter, someday
              to be a physical publication.
            </p>
            <p className='text-lg leading-relaxed'>
              The big gorgeous brains behind BGS are Kelly Slater and Jayne
              Breakfast. They are to your left.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
