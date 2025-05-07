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
    <article className='prose lg:prose-xl dark:prose-invert max-w-7xl bg-background'>
      <div className='wmde-markdown-var'></div>
      <MarkdownPreview
        source={content}
        wrapperElement={{
          'data-color-mode': theme === 'light' ? theme : 'dark',
        }}
        style={{
          fontSize: '1.125rem',
          lineHeight: 1.8,
        }}
      />{' '}
    </article>
  );
}
