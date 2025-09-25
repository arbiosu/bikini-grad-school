import type { Metadata } from 'next';
import { mainFont } from '../../public/fonts/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bikini Grad School',
  description: 'The digital magazine for women and queer people',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${mainFont.className} ${mainFont.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
