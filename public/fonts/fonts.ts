import localFont from 'next/font/local';
import { Courier_Prime, Fraunces } from 'next/font/google';

export const chonkFont = localFont({
  src: './3602-chonk-web.woff2',
  variable: '--font-chonk',
  display: 'swap',
});

export const interlope = localFont({
  src: './interlope-regular.woff2',
  variable: '--font-interlope',
  display: 'swap',
});

export const mainFont = Courier_Prime({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-main',
  display: 'swap',
});

export const fraunces = Fraunces({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});
