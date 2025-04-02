/* eslint-disable @next/next/no-img-element */
import { IMG_WIDTHS } from '@/lib/images/sharp';

interface ImageProps {
  baseUrl: string;
  alt: string;
  widths?: string[];
  className?: string;
  sizes?: string;
}

/**
 *
 * @param baseUrl "/{imageFolder}/{fileName}" without the extension, we will auto load 320-w and .webp files
 * @param alt the alt text for the photo
 * @param widths default to IMG_WIDTHS
 * @param className extend the img with a Tailwind utility
 *
 * @returns
 */
export default function Image({
  baseUrl,
  alt,
  widths = IMG_WIDTHS,
  className,
  sizes = '(max-width: 640px) 320px, (max-width: 960px) 640px, (max-width: 1280px) 960px, (max-width: 1920px) 1280px, 1920px'
}: ImageProps) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images${baseUrl}`;
  const source = `${url}-320w.webp`;
  const srcset = widths
    .map((width) => {
      return `${url}-${width}w.webp ${width}w`;
    })
    .join(', ');
  
  return (
    <img
      loading='lazy'
      alt={alt}
      srcSet={srcset}
      sizes={sizes}
      src={source}
      className={className}
      decoding='async'
    />
  );
}
