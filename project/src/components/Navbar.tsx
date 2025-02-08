import Link from "next/link"

const navLinks = [
  { href: "/", label: "home"},
  { href: "/articles", label: "articles" },
  { href: "/this-month", label: "this month" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
]

export default function Navbar() {
    return (
      <nav className="sticky top-0 z-50 bg-custom-pink-bg p-4">
        <ul className="flex gap-4 text-custom-pink-text text-sm md:text-4xl md:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-pink-900 transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
