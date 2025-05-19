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
  sizes = '(max-width: 480px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, (max-width: 1440px) 70vw, 60vw',
}: ImageProps) {
  const hasBackslash = baseUrl.startsWith('/');
  const backslash = hasBackslash ? '' : '/';

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images${backslash}${baseUrl}`;
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
