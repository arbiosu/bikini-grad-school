import type { Metadata } from "next";
import { playfair } from "../../public/fonts/fonts";
import Navbar from "@/components/Navbar";
import "./globals.css";



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
        className={`${playfair.className} antialiased`}
      >
          <Navbar />
          {children}
      </body>
    </html>
  );
}
