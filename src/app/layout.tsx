import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import {
  mainFont,
  chonkFont,
  interlope,
  fraunces,
} from '../../public/fonts/fonts';
import './globals.css';
import Navbar from '@/components/layout/nav';
import { ThemeProvider } from '@/components/layout/theme-provider';

export const metadata: Metadata = {
  title: {
    default: 'Bikini Grad School',
    template: '%s | Bikini Grad School',
  },
  description:
    'A digital magazine for women and queer people. Subscribe for monthly issues and exclusive add-on content.',
  metadataBase: new URL('https://bikinigradschool.com'),
  openGraph: {
    title: 'Bikini Grad School',
    description:
      'A magazine for women and queer people. Subscribe for access to monthly zines and exclusive add-on content.',
    url: 'https://bikinigradschool.com',
    siteName: 'Bikini Grad School',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/staff-photo-header.jpg',
        width: 1200,
        height: 630,
        alt: 'Bikini Grad School Students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bikini Grad School',
    description:
      'A magazine for women and queer people. Subscribe for monthly issues and exclusive add-on content.',
    images: [
      {
        url: '/staff-photo-header.jpg',
        width: 1200,
        height: 630,
        alt: 'Bikini Grad School Students',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${mainFont.variable} ${chonkFont.variable} ${interlope.variable} ${fraunces.variable} antialiased`}
      >
        <ThemeProvider
          attribute={'class'}
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
