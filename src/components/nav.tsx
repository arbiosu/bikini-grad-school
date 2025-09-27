'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from './theme-toggle';

const navLinks = [
  { href: '/about', label: 'about' },
  { href: '/get-involved', label: 'contribute' },
  { href: '/past-issues', label: 'issues' },
  { href: '/shop', label: 'shop' },
];

export default function Navbar() {
  return (
    <nav className='font-main bg-background sticky top-0 right-0 left-0 z-50 px-2 transition-all duration-300'>
      <div className='flex justify-center p-2'>
        <Image
          src='/bgs-logo.png'
          alt='Bikini Grad School Logo'
          height={64}
          width={64}
          unoptimized
        />
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
          <div className='flex items-center'>
            <Link href='/shop/cart' aria-label='Shopping Cart'>
              <svg
                viewBox='0 0 48 60'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
              >
                <path
                  d='M42 12H36C36 5.37 30.63 0 24 0C17.37 0 12 5.37 12 12H6C2.7 12 0 14.7 0 18V54C0 57.3 2.7 60 6 60H42C45.3 60 48 57.3 48 54V18C48 14.7 45.3 12 42 12ZM24 6C27.3 6 30 8.7 30 12H18C18 8.7 20.7 6 24 6ZM42 54H6V18H12V24C12 25.65 13.35 27 15 27C16.65 27 18 25.65 18 24V18H30V24C30 25.65 31.35 27 33 27C34.65 27 36 25.65 36 24V18H42V54Z'
                  className='fill-black dark:fill-white'
                />
              </svg>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
