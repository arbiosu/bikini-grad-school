import Image from 'next/image';
import localFont from 'next/font/local';
import { Playfair_Display } from 'next/font/google';
import landingPageImage from './../../public/kelly-transparent.png';

const chonk = localFont({ src: '/../../public/fonts/3602-chonk-web.woff2' });
const playfair = Playfair_Display({ subsets: ['latin'] });

export function Hero() {
  return (
    <section className='container mx-auto overflow-hidden'>
      <div className='items-center md:grid md:grid-cols-2'>
        <div className='space-y-8'>
          <h1 className='px-4 text-6xl md:py-20 lg:px-40 lg:text-8xl'>
            <span
              className={`${chonk.className} block text-white`}
              style={{
                textShadow: `
                      -2px -2px 0 #000,
                      2px -2px 0 #000,
                      -2px 2px 0 #000,
                      2px 2px 0 #000,
                      -12px 12px 0 #000
                    `,
                lineHeight: '0.91',
              }}
            >
              BIKINI
            </span>
            <span
              className={`${chonk.className} mx-11 block text-white lg:mx-14 lg:px-3`}
              style={{
                textShadow: `
                      -2px -2px 0 #000,
                      2px -2px 0 #000,
                      -2px 2px 0 #000,
                      2px 2px 0 #000,
                      -12px 12px 0 #000
                    `,
                lineHeight: '0.91',
              }}
            >
              GRAD
            </span>
            <span
              className={`${chonk.className} block text-white`}
              style={{
                textShadow: `
                      -2px -2px 0 #000,
                      2px -2px 0 #000,
                      -2px 2px 0 #000,
                      2px 2px 0 #000,
                      -12px 12px 0 #000
                    `,
                lineHeight: '0.91',
              }}
            >
              SCHOOL
            </span>
          </h1>
          <p
            className={`${playfair.className} px-2 py-4 text-xl text-custom-pink-text lg:px-40`}
          >
            A magazine for women and queer people.
          </p>
          <p className='px-2 text-lg text-custom-pink-text lg:px-40'>
            Our January Edition: Glam is available now.
          </p>
        </div>
        {/* Image */}
        <div className='relative aspect-square w-full'>
          <Image
            src={landingPageImage}
            alt='Bikini Grad School'
            fill
            className='rounded-lg object-cover'
            priority
            placeholder='blur'
          />
        </div>
      </div>
    </section>
  );
}

export function NewHero() {
  return (
    <section className='grid min-h-[100dvh] w-full bg-white text-black md:grid-cols-2'>
      <div className='relative order-last min-h-[50vh] md:min-h-[100dvh]'>
        <Image
          src='/kelly-transparent.png'
          alt='Bikini Grad School Home Page Cover'
          fill
          className='object-cover'
        />
      </div>
      <div className='order-first flex min-h-[50vh] items-center justify-center p-6 md:min-h-[100dvh] md:p-12 lg:p-16'>
        <div className='flex max-w-md flex-col gap-8'>
          <div className='space-y-4'>
            <h1 className='text-lg font-semibold uppercase tracking-wider text-custom-pink-text text-muted-foreground'>
              A magazine for women and queer people.
            </h1>
            <h2 className='text-5xl font-medium tracking-tight lg:text-8xl'>
              <span
                className={`${chonk.className} block leading-chonk text-white text-shadow-chonk`}
              >
                BIKINI
              </span>
              <span
                className={`${chonk.className} mx-6 block text-white lg:mx-14 lg:px-3`}
                style={{
                  textShadow: `
                          -2px -2px 0 #000,
                          2px -2px 0 #000,
                          -2px 2px 0 #000,
                          2px 2px 0 #000,
                          -12px 12px 0 #000
                        `,
                  lineHeight: '0.91',
                }}
              >
                GRAD
              </span>
              <span
                className={`${chonk.className} block text-white`}
                style={{
                  textShadow: `
                          -2px -2px 0 #000,
                          2px -2px 0 #000,
                          -2px 2px 0 #000,
                          2px 2px 0 #000,
                          -12px 12px 0 #000
                        `,
                  lineHeight: '0.91',
                }}
              >
                SCHOOL
              </span>
            </h2>
            <h3 className='py-6 text-lg font-semibold uppercase tracking-wider text-custom-pink-text text-muted-foreground'>
              Our January Edition: Glam is available now.
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
