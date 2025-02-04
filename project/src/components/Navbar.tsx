import Link from "next/link"

const navLinks = [
  { href: "/about", label: "about" },
  { href: "/articles", label: "articles" },
  { href: "/this-month", label: "this month" },
  { href: "/contact", label: "contact" },
  { href: "/contribute", label: "contribute"}
]

export default function Navbar() {
  return (
    <nav className="p-4">
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

