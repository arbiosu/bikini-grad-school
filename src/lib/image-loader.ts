import type { ImageLoaderProps } from 'next/image';

const normalizeSrc = (src: string) => {
  return src.startsWith('/') ? src.slice(1) : src;
};

export default function cloudflareLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  let ASSET_URL = 'https://bikinigradschoolassets.com';
  if (process.env.NODE_ENV === 'development') {
    ASSET_URL = 'https://pub-2e58def0a2d64e1992d76e72a67be0ee.r2.dev';
    console.log(`${ASSET_URL}/${normalizeSrc(src)}`);

    return `${ASSET_URL}/${normalizeSrc(src)}`;
  }

  const params = [`width=${width}`, `quality=${quality || 75}`];
  return `${ASSET_URL}/cdn-cgi/image/${params.join(',')}/${normalizeSrc(src)}`;
}
