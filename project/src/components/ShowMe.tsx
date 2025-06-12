// ShowMe.tsx
import Link from 'next/link';
import Image from './Image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ShowMeProps {
  label: string;
  imgUrl: string;
  href: string;
}

function ShowMeCard({ label, imgUrl, href }: ShowMeProps & { index: number }) {
  return (
    <Link href={href} className='group block'>
      <Card
        className={cn(
          'relative overflow-hidden border-none shadow-none',
          'transition-all duration-700 ease-out',
          'hover:-translate-y-2 hover:rotate-1 group-hover:scale-[1.02]'
        )}
      >
        {/* Subtle gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

        {/* Animated border effect */}
        <div className='absolute inset-0 rounded-lg bg-gradient-to-r from-bgs-pink/20 via-purple-500/20 to-bgs-pink/20 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100' />

        <CardContent className='relative h-full p-0'>
          {/* Image container */}
          <div className='relative h-64 overflow-hidden rounded-t-lg md:h-80'>
            <Image
              baseUrl={imgUrl}
              alt={label}
              className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
            />

            {/* Shimmer effect on hover */}
            <div className='absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full' />
          </div>

          {/* Content area */}
          <div className='relative p-6 text-center'>
            <h3 className='text-2xl font-semibold transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-indigo-800 group-hover:to-bgs-pink group-hover:bg-clip-text group-hover:text-transparent group-hover:underline md:text-3xl'>
              {label}
            </h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ShowMeGrid({ cards }: { cards: ShowMeProps[] }) {
  if (cards.length === 0) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
            <svg
              className='h-8 w-8 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4m16 0l-2-2m-2 2l2 2M4 13l2-2m0 0l2 2'
              />
            </svg>
          </div>
          <p className='text-xl text-gray-500 dark:text-gray-400'>
            No items to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-6xl p-4'>
      {/* Simple responsive grid for equal-sized cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {cards.map((card, index) => (
          <ShowMeCard key={`${card.href}-${index}`} {...card} index={index} />
        ))}
      </div>
    </div>
  );
}
