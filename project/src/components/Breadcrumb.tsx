import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"

interface BreadcrumbProps {
  homeElement?: React.ReactNode
  separator?: React.ReactNode
  containerClasses?: string
  listClasses?: string
  activeClasses?: string
  capitalizeLinks?: boolean
}

export function Breadcrumb({
  homeElement,
  separator,
  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks,
}: BreadcrumbProps) {
  const paths = usePathname()
  const pathNames = paths.split("/").filter((path) => path)

  return (
    <nav aria-label="breadcrumb" className={containerClasses}>
      <ol className={`flex ${listClasses}`}>
        <li className="flex items-center">
          <Link href="/" className="text-gray-500 hover:text-pink-600 transition-colors">
            {homeElement || "Home"}
          </Link>
        </li>
        {pathNames.length > 0 && separator}
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`
          const itemClasses =
            paths === href
              ? `${activeClasses} font-semibold pointer-events-none`
              : "text-gray-500 hover:text-pink-600 transition-colors"
          const itemLink = capitalizeLinks ? link[0].toUpperCase() + link.slice(1, link.length) : link

          return (
            <li className="flex items-center" key={index}>
              <Link href={href} className={itemClasses}>
                {itemLink}
              </Link>
              {pathNames.length !== index + 1 && separator}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

