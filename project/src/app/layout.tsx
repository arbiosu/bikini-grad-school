import type { Metadata } from "next";
import localFont from 'next/font/local'
import Navbar from "@/components/Navbar";
import "./globals.css";

const font = localFont({ src: '/../../public/fonts/HelveticaNeueLight.otf'})


export const metadata: Metadata = {
  title: "Bikini Grad School",
  description: "A magazine for women and queer people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} ${font.className} antialiased bg-white`}
      >
          <Navbar />
          {children}
      </body>
    </html>
  );
}
