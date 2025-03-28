import Image from 'next/image';
import { chonk } from '../../public/fonts/fonts';

export function PictureDivider(props: { imgUrl: string; text: string }) {
  const { imgUrl, text } = props;
  return (
    <div className='relative mb-10 py-40'>
      <Image
        src={imgUrl || '/placeholder.svg'}
        alt='Staff Page'
        fill
        sizes='100vw'
        className='object-cover'
      />
      <div className='absolute inset-0 flex items-center justify-center'>
        <span
          className={`${chonk.className} z-10 px-4 text-center text-5xl text-white text-shadow-chonk dark:text-shadow-chonk-dark lg:text-8xl`}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
