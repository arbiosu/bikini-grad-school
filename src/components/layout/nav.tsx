'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from './theme-toggle';
import { UserCircle2, Handbag } from 'lucide-react';

const navLinks = [
  { href: '/about', label: 'about' },
  { href: '/shop', label: 'zine club' },
  { href: '/issues', label: 'issues' },
];

export default function Navbar() {
  return (
    <nav className='font-main bg-background sticky top-0 right-0 left-0 z-50 px-2'>
      <div className='flex justify-center p-2'>
        <Link href='/'>
          <Image
            src='public/bgs-logo.png'
            alt='Bikini Grad School Logo'
            height={64}
            width={64}
            className='h-16 w-16'
            priority
          />
        </Link>
      </div>
      <div className='relative flex items-center justify-center'>
        <div className='flex gap-2 md:gap-6'>
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className='hover:underline md:text-2xl'
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className='absolute right-0'>
          <div className='flex items-center gap-1.5'>
            <Link href='/shop' aria-label='Shopping Cart'>
              <Handbag />
            </Link>
            <Link href='/my-account' aria-label='User Account Page'>
              <UserCircle2 />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
