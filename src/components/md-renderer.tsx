'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <article className='mx-auto max-w-3xl'>
        <div className='prose bg-background dark:prose-invert lg:prose-xl rounded-2xl p-6'>
          <div className='animate-pulse'>
            <div className='mb-4 h-4 w-3/4 rounded bg-gray-200'></div>
            <div className='mb-4 h-4 w-1/2 rounded bg-gray-200'></div>
            <div className='h-4 w-5/6 rounded bg-gray-200'></div>
          </div>
        </div>
      </article>
    );
  }

  const currentTheme = resolvedTheme || theme || 'light';

  return (
    <article className='mx-auto max-w-3xl'>
      <div
        data-color-mode={currentTheme}
        className='prose bg-background dark:prose-invert lg:prose-xl rounded-2xl p-6'
      >
        <MarkdownPreview
          source={content}
          style={{ background: 'transparent' }}
        />
      </div>
    </article>
  );
}
