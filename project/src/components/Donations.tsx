import DonationBox from './DonationBox';
import { ChonkText } from './Chonk';
import Image from './Image';

export default function DonationSection() {
  return (
    <section id='donations' className='w-full px-4 py-16 sm:px-6 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20'>
          {/* Content Column */}
          <div className='flex flex-col items-center text-center lg:items-start lg:text-left'>
            <ChonkText
              strings={['SUPPORT BGS']}
              variant={'medium'}
              className='mb-8 sm:mb-12 lg:text-left'
            />

            <div className='mx-auto mb-8 max-w-lg lg:mx-0'>
              <p className='mb-4 text-base leading-relaxed sm:text-lg'>
                a little love for your favorite mag goes a long way!
              </p>
              <p className='mb-6 text-base leading-relaxed sm:text-lg'>
                with your generosity, we can support women and nb artists in
                bringing you the content you love.
              </p>
            </div>

            <div className='mx-auto w-full max-w-md lg:mx-0'>
              <DonationBox />
            </div>
          </div>

          {/* Image Column */}
          <div className='flex justify-center lg:justify-end'>
            <div className='relative aspect-square w-full max-w-md lg:max-w-lg xl:max-w-xl'>
              <Image
                baseUrl='content/support-us'
                alt='Supporting BGS Magazine - Featured artist'
                className='h-full w-full object-cover shadow-lg'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
