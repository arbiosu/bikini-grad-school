import localFont from 'next/font/local';
import { Courier_Prime } from 'next/font/google';

export const chonk = localFont({ src: './3602-chonk-web.woff2' });

export const courierPrime = Courier_Prime({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});
