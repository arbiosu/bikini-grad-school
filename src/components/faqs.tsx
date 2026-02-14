'use client';

import { useRef } from 'react';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQ[];
}

export function FAQHorizontalScroll({ faqs }: FAQProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className='font-main bg-alt-pink dark:bg-background dark:text-primary mx-auto w-full max-w-full py-6 text-black'>
      <div
        ref={scrollRef}
        className='relative flex flex-nowrap overflow-x-auto'
      >
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className='mr-4 inline-flex w-96 shrink-0 flex-col p-6 last:mr-0'
          >
            <p className='mb-8 h-20 text-xl font-bold'>{faq.question}</p>
            <p className='text-lg leading-5 font-light'>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
