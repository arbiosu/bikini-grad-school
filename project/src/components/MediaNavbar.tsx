import Link from 'next/link';

const links = [
  {
    href: '/past-issues',
    label: 'past issues',
  },
  {
    href: '/articles',
    label: 'articles',
  },
  {
    href: '/digimedia',
    label: 'digimedia',
  },
  {
    href: '/features',
    label: 'features',
  },
];

export default function MediaNavbar() {
  return (
    <div className='w-full px-4 py-6'>
      <nav className='flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-16'>
        {links.map((link, index) => (
          <Link
            href={link.href}
            key={index}
            className='text-lg transition-colors duration-200 hover:underline sm:text-xl md:text-2xl'
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
