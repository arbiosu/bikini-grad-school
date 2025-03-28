import { chonk } from '../../public/fonts/fonts';

function LandinPageVideo() {
  return (
    <div className='absolute inset-0 h-full w-full overflow-hidden'>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload='auto'
        className='h-full w-full object-cover'
      >
        <source
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/images/videos/bgs-compressed.mp4`}
          type='video/mp4'
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export function ComingSoon() {
  return (
    <section className='py-10'>
      <h1 className='px-4 text-center text-5xl text-white dark:text-black lg:text-8xl'>
        <span
          className={`${chonk.className} block leading-chonk text-shadow-chonk dark:text-shadow-chonk-dark`}
        >
          COMING
        </span>
        <span
          className={`${chonk.className} block leading-chonk text-shadow-chonk dark:text-shadow-chonk-dark`}
        >
          SOON
        </span>
      </h1>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className='relative h-screen w-full'>
      <LandinPageVideo />
      <div className='absolute inset-0 mx-8 flex flex-col items-center justify-center'>
        <h1 className='px-4 text-5xl text-white md:py-20 lg:px-40 lg:text-8xl'>
          <div className='mx-auto'>
            <span
              className={`${chonk.className} mx-4 block leading-chonk text-shadow-chonk`}
            >
              BIKINI
            </span>
            <span
              className={`${chonk.className} mx-12 block leading-chonk text-shadow-chonk lg:mx-16`}
            >
              GRAD
            </span>
            <span
              className={`${chonk.className} mx-2 mb-6 block leading-chonk text-shadow-chonk`}
            >
              SCHOOl
            </span>
          </div>
        </h1>
        <h2 className='text-xl font-medium shadow-sm text-white'>
          a magazine for women and queer people
        </h2>
      </div>
    </div>
  );
}
