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
      <nav className="sticky top-0 z-50 bg-pink-100 p-4">
        <ul className="flex gap-8 text-pink-500 text-lg">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-pink-700 transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
