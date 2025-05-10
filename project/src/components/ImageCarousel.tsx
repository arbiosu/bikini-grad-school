'use client';

import React, { useState, useCallback } from 'react';
import Image from './Image'; // Assuming Image.tsx is in the same directory or adjust path

// Define the props for the Carousel component
interface CarouselProps {
  images: string[];
  /** Optional className for the main carousel container */
  className?: string;
  /** Optional className to be passed to each Image component */
  imageClassName?: string;
  /** Optional sizes attribute to be passed to each Image component, overriding its default */
  imageSizes?: string;
  /** Optional widths array to be passed to each Image component, overriding its default */
  imageWidths?: string[];
}

/**
 * A multi-image carousel component.
 * It uses a custom Image component for rendering optimized images.
 */
const Carousel: React.FC<CarouselProps> = ({
  images,
  className = '',
  imageClassName = '',
  imageSizes, // Will use default from Image component if undefined
  imageWidths, // Will use default from Image component if undefined
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalImages = images.length;

  // --- Optimization: useCallback ---
  // These functions are memoized to prevent unnecessary re-creation on each render,
  // which can be beneficial if passed down to memoized child components (though less critical for simple buttons).
  // The dependency array [totalImages] ensures they update if the number of images changes.
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  }, [totalImages]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  }, [totalImages]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex);
  }, []); // No dependencies needed here as it directly sets the index

  // --- Edge Case Handling ---
  if (!images || totalImages === 0) {
    // It's good practice to provide feedback or a fallback UI.
    // Depending on requirements, you might return null or a more styled placeholder.
    return (
      <div
        className={`flex h-64 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}
      >
        <p className='text-gray-500 dark:text-gray-400'>
          No images to display.
        </p>
      </div>
    );
  }

  //const currentImage = images[currentIndex];

  return (
    <div
      className={`group relative w-full ${className}`}
      role='region'
      aria-roledescription='carousel'
    >
      {/* Main Image Display Area */}
      {/*
        - `overflow-hidden` is key for the sliding effect.
        - The inner `div` with `flex` will hold all images side-by-side.
        - `transition-transform` and `ease-in-out` provide the smooth slide.
        - `transform: translateX(-${currentIndex * 100}%)` moves the correct image into view.
      */}
      <div className='overflow-hidden rounded-lg'>
        <div
          className='flex transition-transform duration-500 ease-in-out'
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          aria-live='polite' // Announces changes to screen readers
        >
          {images.map((img, index) => (
            <div
              key={index} // Using index as key is generally okay for static lists or when order doesn't change. If images could be reordered, use a unique ID.
              className='w-full flex-shrink-0' // Each image container takes full width and doesn't shrink.
              role='group'
              aria-roledescription='slide'
              aria-label={`Image ${index + 1} of ${totalImages}`} // Accessibility: label each slide
            >
              <Image
                baseUrl={img}
                alt={`Carousel index ${index}`}
                // --- Production Ready: Propagating Customization ---
                // Allow overriding Image component's defaults from Carousel props
                widths={imageWidths}
                sizes={imageSizes}
                className={`h-auto w-full object-cover ${imageClassName}`} // `h-auto` maintains aspect ratio. `object-cover` ensures the image fills its container.
                // You might want a fixed height for the carousel, e.g., `h-64` or `h-96`,
                // then `object-cover` becomes more important.
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls - only show if there's more than one image */}
      {totalImages > 1 && (
        <>
          {/* Previous Button */}
          <button
            type='button'
            onClick={goToPrevious}
            className='absolute left-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black bg-opacity-30 p-2 text-white opacity-0 transition-all duration-150 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 group-hover:opacity-100 sm:left-4 sm:p-3'
            aria-label='Previous image'
          >
            <svg
              className='h-5 w-5 sm:h-6 sm:w-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 19l-7-7 7-7'
              ></path>
            </svg>
          </button>

          {/* Next Button */}
          <button
            type='button'
            onClick={goToNext}
            className='absolute right-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black bg-opacity-30 p-2 text-white opacity-0 transition-all duration-150 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 group-hover:opacity-100 sm:right-4 sm:p-3'
            aria-label='Next image'
          >
            <svg
              className='h-5 w-5 sm:h-6 sm:w-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 5l7 7-7 7'
              ></path>
            </svg>
          </button>

          {/* Indicator Dots */}
          <div className='absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 transform space-x-2 sm:bottom-4 sm:space-x-3'>
            {images.map((_, index) => (
              <button
                key={`dot-${index}`}
                type='button'
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-colors duration-150 sm:h-2.5 sm:w-2.5 ${
                  currentIndex === index
                    ? 'scale-125 bg-white'
                    : 'bg-white bg-opacity-40 hover:bg-opacity-70'
                } focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-black/20`}
                aria-label={`Go to image ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : 'false'} // Accessibility: indicates current item
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel; // Consider React.memo if props are stable and renders are costly
// Example: export default React.memo(Carousel);
