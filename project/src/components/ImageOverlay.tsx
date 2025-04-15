import { cva, type VariantProps } from 'class-variance-authority';
import Image from '@/components/Image';
import { cn } from '@/lib/utils';
import { chonk } from '../../public/fonts/fonts';

const imageOverlayVariants = cva('relative overflow-hidden text-white', {
  variants: {
    aspectRatio: {
      aspectVideo: 'aspect-video w-full',
      aspectSquare: 'aspect-square w-full',
    },
  },
  defaultVariants: {
    aspectRatio: 'aspectVideo',
  },
});

const textPositionVariants = cva('absolute z-10 flex items-center p-4', {
  variants: {
    textPosition: {
      center: 'inset-0 justify-center text-center',
      left: 'left-0 inset-0',
    },
  },
  defaultVariants: {
    textPosition: 'center',
  },
});

const textStyleVariants = cva(
  'max-w-full text-center text-white text-shadow-chonk',
  {
    variants: {
      textSize: {
        small: 'text-xl md:text-2xl lg:text-3xl',
        medium: 'text-2xl md:text-4xl lg:text-5xl',
        large: 'text-3xl md:text-6xl lg:text-8xl',
      },
    },
    defaultVariants: {
      textSize: 'large',
    },
  }
);

interface ImageOverlayCardProps
  extends VariantProps<typeof imageOverlayVariants>,
    VariantProps<typeof textPositionVariants>,
    VariantProps<typeof textStyleVariants> {
  imgUrl: string;
  altText: string;
  overlayText: string[];
}

export default function ImageOverlayCard({
  imgUrl,
  altText,
  overlayText,
  aspectRatio,
  textPosition,
  textSize,
}: ImageOverlayCardProps) {
  return (
    <div className={cn(imageOverlayVariants({ aspectRatio }))}>
      <Image
        baseUrl={imgUrl}
        alt={altText}
        className='absolute inset-0 z-0 h-full w-full object-cover'
      />
      <div className={cn(textPositionVariants({ textPosition }))}>
        <div>
          {overlayText.map((text, index) => (
            <p
              key={index}
              className={cn(
                textStyleVariants({ textSize }),
                `${chonk.className}`
              )}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
