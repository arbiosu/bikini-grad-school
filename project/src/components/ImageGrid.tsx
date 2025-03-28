import Image from 'next/image';
import { chonk } from '../../public/fonts/fonts';
import { ChonkText } from '@/components/Chonk';

interface ImageGridTextOverlayProps {
  imgUrl: string;
  text: string;
}

export default function ImageTextGrid(props: {
  imgUrl: string;
  first: string;
  second: string;
}) {
  const { imgUrl, first, second } = props;
  return (
    <div className='grid h-screen w-full grid-cols-1 bg-background md:grid-cols-2'>
      {/* Left side - Image */}
      <div className='relative h-full w-full'>
        <Image
          src={imgUrl}
          alt='Featured image'
          fill
          className='object-cover'
          priority
        />
      </div>

      {/* Right side - Text */}
      <div className='flex items-start justify-center bg-background p-4 md:items-center'>
        <div className='w-full pt-4 md:max-w-xl md:pt-0'>
          <ChonkText first={first} second={second} />
        </div>
      </div>
    </div>
  );
}

function ImageTextOverlay({ imgUrl, text }: ImageGridTextOverlayProps) {
  return (
    <div className='relative aspect-[16/9] w-full transition-transform hover:scale-95 focus:scale-95 active:scale-95'>
      <Image
        src={imgUrl}
        alt={text}
        fill
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        priority
        className='mb-4'
      />
      <h2
        className={`${chonk.className} absolute inset-0 flex items-center justify-center text-center text-4xl text-white lg:text-6xl`}
      >
        {text}
      </h2>
    </div>
  );
}

export function ImageGridTextOverlay({
  images,
}: {
  images: ImageGridTextOverlayProps[];
}) {
  return (
    <div className='container mx-auto'>
      <div className='grid gap-4 md:grid-cols-2'>
        {images.map((image, index) => (
          <ImageTextOverlay key={index} {...image} />
        ))}
      </div>
    </div>
  );
}
