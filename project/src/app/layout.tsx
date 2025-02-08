import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"] })


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
        className={`${openSans.className} ${openSans.className} antialiased bg-custom-pink-bg`}
      >
          <Navbar />
          {children}
      </body>
    </html>
  );
}
