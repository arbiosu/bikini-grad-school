import localFont from 'next/font/local';
import { Courier_Prime, Playfair_Display } from 'next/font/google';

export const chonk = localFont({ src: './3602-chonk-web.woff2' });

export const helveticaNeueLight = localFont({
  src: '/../../public/fonts/HelveticaNeueLight.otf',
});

export const playfair = Playfair_Display({ subsets: ['latin'] });

export const specialElite = Courier_Prime({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});
