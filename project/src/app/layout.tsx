import type { Metadata } from "next";
import localFont from 'next/font/local'
import { NewNavbar } from "@/components/Navbar";
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
        className={`${font.className} ${font.className} antialiased bg-bgs-pink`}
      >
          <NewNavbar />
          {children}
      </body>
    </html>
  );
}
