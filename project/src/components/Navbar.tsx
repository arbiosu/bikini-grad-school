"use client";

import Link from "next/link"
import Image from "next/image"
import { MenuIcon, XIcon } from "lucide-react"
import { useState } from "react"


const navLinks = [
  { href: "/this-month", label: "this month" },
  { href: "/articles", label: "articles" },
  { href: "/about", label: "about" },
]

const mobileNavLinks = [
  { href: "/", label: "home" },
  { href: "/this-month", label: "this month" },
  { href: "/articles", label: "articles" },
  { href: "/about", label: "about" },
  { href: "/contribute", label: "contribute" },
]


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-bgs-pink">
      <div className="relative mx-auto max-w-7xl px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-custom-pink-text hover:text-black transition-colors"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* Desktop navigation links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="italic font-bold text-2xl text-custom-pink-text hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Centered logo */}
          <div className="absolute left-1/2 top-6 bottom-0 z-10 -translate-x-1/2 -translate-y-1/2">
            <Link href="/">
              <Image
                src='/butterfly.png'
                alt="Bikini Grad School Butterfly"
                width={100}
                height={150}
                className="w-auto h-auto"
                priority
              />
            </Link>
          </div>

          {/* Contribute button */}
          <div>
            <Link
              href='/contribute'
              className="rounded-full border border-black px-4 py-1 font-extrabold text-lg italic tracking-wide text-black transition-colors hover:bg-black hover:text-white bg-white"
            >
              contribute
            </Link>
          </div>
        </div>

        {/* Mobile menu overlay */}
          <div className={`fixed inset-0 z-[100] bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col p-8 space-y-4">
              <button
                onClick={() => setIsOpen(false)}
                className="self-end p-2"
                aria-label="Close menu"
              >
                <XIcon className="w-6 h-6 text-black text-2xl" />
              </button>
              {mobileNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-medium text-custom-pink-text hover:text-pink-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        <div className="absolute bottom-4 left-8 right-8 h-[2px] bg-custom-pink-text" />
      </div>
    </nav>
  );
}

export function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-bgs-pink flex items-center justify-between w-full p-4">
      <div>
        <Image
          src="/butterfly.png"
          alt="Bikini Grad School Butterfly"
          width={48}
          height={48}
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2"
          aria-label="Toggle menu"
        >
          {<MenuIcon className="w-6 h-6 text-black" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-[100] bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col p-8 space-y-4">
          <button
            onClick={() => setIsOpen(false)}
            className="self-end p-2"
            aria-label="Close menu"
          >
            <XIcon className="w-6 h-6 text-black text-2xl" />
          </button>
          {mobileNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-medium text-custom-pink-text hover:text-pink-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
