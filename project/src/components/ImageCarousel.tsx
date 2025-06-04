'use client';

import { useRef, useState } from 'react';
import Image from './Image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export function ImageCarousel({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const openFullscreen = (index: number) => {
    setSelectedImage(index);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;

    if (direction === 'prev' && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    } else if (direction === 'next' && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeFullscreen();
    } else if (e.key === 'ArrowLeft') {
      navigateImage('prev');
    } else if (e.key === 'ArrowRight') {
      navigateImage('next');
    }
  };

  return (
    <div className='relative w-full'>
      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className='scrollbar-hide flex gap-4 overflow-x-auto py-6 md:gap-6'
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className='flex-shrink-0'
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className='group relative aspect-[3/4] w-64 cursor-pointer overflow-hidden bg-gray-100 sm:w-72 md:w-80 lg:w-96'>
              <Image
                baseUrl={image}
                alt={`Photoshoot image ${index + 1}`}
                className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
                sizes='(max-width: 640px) 256px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 384px'
              />
              {/* Hover overlay with zoom icon */}
              <div
                className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-all duration-300 group-hover:opacity-100'
                onClick={() => openFullscreen(index)}
              >
                <ZoomIn className='h-8 w-8 text-white drop-shadow-lg' />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollLeft}
        className='absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white'
        aria-label='Previous image'
      >
        <ChevronLeft className='h-5 w-5' />
      </button>

      <button
        onClick={scrollRight}
        className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white'
        aria-label='Next image'
      >
        <ChevronRight className='h-5 w-5' />
      </button>

      {/* Fullscreen Modal */}
      {selectedImage !== null && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm'
          onClick={closeFullscreen}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeFullscreen}
            className='z-60 absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20'
            aria-label='Close fullscreen view'
          >
            <X className='h-6 w-6' />
          </button>

          {/* Previous button */}
          {selectedImage > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className='z-60 absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20'
              aria-label='Previous image'
            >
              <ChevronLeft className='h-6 w-6' />
            </button>
          )}

          {/* Next button */}
          {selectedImage < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className='z-60 absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20'
              aria-label='Next image'
            >
              <ChevronRight className='h-6 w-6' />
            </button>
          )}

          {/* Main image container */}
          <div
            className='relative flex h-full max-h-[90vh] w-full max-w-[90vw] items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              baseUrl={images[selectedImage]}
              alt={`Fullscreen photoshoot image ${selectedImage + 1}`}
              className='max-h-full max-w-full object-contain shadow-2xl'
              sizes='90vw'
            />
          </div>

          {/* Image counter */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm'>
            <span className='text-sm font-medium'>
              {selectedImage + 1} of {images.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
