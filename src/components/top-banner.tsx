// source: https://flowbite.com/docs/components/banner/

import Link from 'next/link';
import Image from 'next/image';

export default function Banner() {
  return (
    <div id='sticky-banner' className='bg-alt-pink dark:bg-background'>
      <div className='mx-auto flex justify-center p-4'>
        <span className='font-main dark:text-primary text-2xl font-bold text-black'>
          *get monthly snail mail*
        </span>
      </div>
    </div>
  );
}
