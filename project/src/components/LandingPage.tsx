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

export default function LandingPage() {
  return (
    <div className='relative h-screen w-full'>
      <LandinPageVideo />
      <div className='absolute inset-0 mx-8 flex flex-col items-center justify-center'>
        <h1 className='px-4 text-6xl text-white md:py-20 lg:px-40 lg:text-8xl'>
          <div className='mx-auto'>
            <span
              className={`${chonk.className} block text-center leading-chonk text-shadow-chonk`}
            >
              BIKINI
            </span>
            <span
              className={`${chonk.className} block text-center leading-chonk text-shadow-chonk`}
            >
              GRAD
            </span>
            <span
              className={`${chonk.className} mb-6 block text-center leading-chonk text-shadow-chonk`}
            >
              SCHOOl
            </span>
          </div>
        </h1>
        <h2 className='text-xl font-medium text-white drop-shadow-lg'>
          a magazine for women and queer people
        </h2>
      </div>
    </div>
  );
}
