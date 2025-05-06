import Link from 'next/link';

const links = [
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
    <div>
      <div className='flex justify-center gap-20'>
        {links.map((link, index) => (
          <Link
            href={link.href}
            key={index}
            className='text-xl hover:underline md:text-2xl'
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
