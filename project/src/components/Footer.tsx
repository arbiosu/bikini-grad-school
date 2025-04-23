import Link from 'next/link';
import BGSLogo from './BGSlogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='py-10'>
      <div className='mt-8 border-t border-gray-200 pt-8 text-center text-sm'></div>

      <Link href='/' className='mb-4 flex justify-center'>
        <BGSLogo />
      </Link>
      <p className='text-center text-sm'>
        &copy; {currentYear} Bikini Grad School. All rights reserved.
      </p>
    </footer>
  );
}
