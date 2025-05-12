'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { theme } = useTheme();

  return (
    <article className='mx-auto max-w-7xl'>
      <div
        data-color-mode={theme === 'light' ? 'light' : 'dark'}
        className='prose rounded-2xl bg-background p-6 dark:prose-invert lg:prose-xl'
      >
        <MarkdownPreview
          source={content}
          style={{ background: 'transparent' }}
        />
      </div>
    </article>
  );
}
