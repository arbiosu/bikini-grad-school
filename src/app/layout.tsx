import type { Metadata } from 'next';
import { mainFont, chonkFont } from '../../public/fonts/fonts';
import './globals.css';
import Navbar from '@/components/layout/nav';
import { ThemeProvider } from '@/components/layout/theme-provider';

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
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${mainFont.variable} ${chonkFont.variable} antialiased`}
      >
        <ThemeProvider
          attribute={'class'}
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
