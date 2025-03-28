"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X } from "lucide-react"
import { specialElite } from "@/../public/fonts/fonts"

const navLinks = [
  { href: "/about", label: "about" },
  { href: "/get-involved", label: "get involved" },
  { href: "/past-issues", label: "past issues" },
  { href: "/shop", label: "shop" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition > 10) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <header
      className={`${specialElite.className} fixed top-0 left-0 right-0 flex h-20 items-center px-4 text-black z-50 transition-all duration-300 ${
        hasScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <Link href="/" className="z-10">
        <Image src="/bgs.svg" alt="Bikini Grad School" width={64} height={64} />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-1 justify-center gap-6">
        {navLinks.map((link, index) => (
          <Link href={link.href} key={index}>
            <p className="hover:underline">{link.label}</p>
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden ml-auto mr-4 z-10" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? <X /> : <Menu />}
      </button>

      <Link href="/shop/cart" className="z-10">
        <ShoppingCart />
      </Link>

      {/* Mobile Navigation Overlay - Always in DOM with transition */}
      <div
        className={`fixed inset-0 bg-white md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <nav
          className={`flex flex-col items-center justify-center h-full transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-y-0" : "translate-y-8"
          }`}
        >
          {navLinks.map((link, index) => (
            <Link href={link.href} key={index} onClick={toggleMenu} className="text-lg my-3">
              <p className="hover:underline">{link.label}</p>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
