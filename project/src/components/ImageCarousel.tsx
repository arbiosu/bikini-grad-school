'use client';

import { useRef } from 'react';
import Image from './Image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ImageCarousel({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className='w-full py-6'>
      <div
        ref={scrollRef}
        className='relative flex flex-nowrap overflow-x-auto px-2 py-4'
      >
        {images.map((image, index) => (
          <div
            key={index}
            className='mr-4 inline-block flex-shrink-0 p-6 align-top last:mr-0'
          >
            <Image baseUrl={image} alt={`Image number ${index}`} />
          </div>
        ))}
      </div>
      {/* Buttons */}
      <div className='mt-6 flex justify-between'>
        <button onClick={scrollLeft} aria-label='Scroll left'>
          <ChevronLeft />
        </button>
        <button onClick={scrollRight} aria-label='Scroll right'>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
