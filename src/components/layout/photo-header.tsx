import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva(
  'relative overflow-hidden font-chonk chonk-shadow text-white',
  {
    variants: {
      aspectRatio: {
        video: 'aspect-video',
        square: 'aspect-square',
      },
    },
    defaultVariants: {
      aspectRatio: 'video',
    },
  }
);

const overlayVariants = cva('absolute inset-0 z-10 flex', {
  variants: {
    textPosition: {
      center: 'items-center justify-center text-center',
      left: 'items-center justify-start pl-6 text-left',
    },
  },
  defaultVariants: {
    textPosition: 'center',
  },
});

const textVariants = cva('', {
  variants: {
    textSize: {
      small: 'text-xl md:text-2xl lg:text-3xl',
      medium: 'text-2xl md:text-4xl lg:text-5xl',
      large: 'text-3xl md:text-6xl lg:text-8xl',
    },
  },
  defaultVariants: {
    textSize: 'medium',
  },
});

interface PhotoHeaderProps
  extends
    VariantProps<typeof containerVariants>,
    VariantProps<typeof overlayVariants>,
    VariantProps<typeof textVariants> {
  imgUrl: string;
  altText: string;
  overlayText: string[];
}

export default function PhotoHeader({
  imgUrl,
  altText,
  overlayText,
  aspectRatio,
  textPosition,
  textSize,
}: PhotoHeaderProps) {
  return (
    <div className={cn(containerVariants({ aspectRatio }))}>
      <Image
        src={imgUrl}
        alt={altText}
        className='absolute inset-0 z-0 h-full w-full object-cover'
        height={400}
        width={800}
        priority
      />
      <div className={cn(overlayVariants({ textPosition }))}>
        <div className='space-y-2'>
          {overlayText.map((text, index) => (
            <p key={index} className={cn(textVariants({ textSize }))}>
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
