import { chonk } from '../../public/fonts/fonts';
import Image from '@/components/Image';
import Grid from '@/components/Grid';

interface ImageOverlayCardProps {
  imgUrl: string;
  altText: string;
  overlayText: string[];
  className?: string;
  textPosition: string;
  textSizes?: {
    base: number;
    md: number;
    lg: number;
  };
}

export default function ImageOverlayCard({
  imgUrl,
  altText,
  overlayText,
  className,
  textPosition,
  textSizes = { base: 3, md: 6, lg: 8 },
}: ImageOverlayCardProps) {
  const textSize = `text-${textSizes.base}xl md:text-${textSizes.md}xl lg:text-${textSizes.lg}xl`;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        baseUrl={imgUrl}
        alt={altText}
        className='absolute inset-0 z-0 h-full w-full object-cover'
      />
      <div
        className={`absolute ${textPosition} z-10 flex h-full w-full items-center p-4`}
      >
        <div>
          {overlayText.map((text, index) => (
            <p
              key={index}
              className={`${chonk.className} max-w-full text-center text-white text-shadow-chonk ${textSize}`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ImageOverlayGrid({
  images,
}: {
  images: ImageOverlayCardProps[];
}) {
  return (
    <div className="container mx-auto">
      <Grid
        items={images}
        renderItem={(image) => <ImageOverlayCard {...image} />}
        variant={"small"}
      />
    </div>
  );
}
