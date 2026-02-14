import Image from 'next/image';

export default function Page() {
  return (
    <section className='font-main h-screen'>
      <div className='grid h-full lg:grid-cols-2'>
        <div className='relative h-64 lg:h-full'>
          <Image
            src='public/bgs-jk.png'
            alt='Kelly (left) and Jayne (right) from Bikini Grad School'
            fill
            className='object-cover'
            sizes='(max-width: 1024px) 100vw, 50vw'
            priority
          />
        </div>

        <div className='flex items-center justify-center p-8 lg:p-16'>
          <div className='max-w-2xl space-y-6'>
            <div className='relative w-40'>
              <Image
                src='public/about-cursive.png'
                alt='The word about written in cursive'
                width={200}
                height={200}
              />
            </div>
            <p className='text-left text-xl'>
              Bikini Grad School is a magazine and art community.
            </p>
            <p className='text-xl'>
              Bikini Grad School was born out of a want for connection in adult
              life. The mag works to build community through creative
              conversations, in-person events and a monthly zine, someday to be
              a physical publication.
            </p>
            <p className='text-xl'>
              The big gorgeous brains behind BGS are Kelly Slater and Jayne
              Breakfast.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
