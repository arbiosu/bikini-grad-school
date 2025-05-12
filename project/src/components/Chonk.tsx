import { chonk } from '../../public/fonts/fonts';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const chonkVariants = cva(
  `${chonk.className} block leading-chonk text-center text-white text-shadow-chonk-small md:text-shadow-chonk`,
  {
    variants: {
      variant: {
        small: 'text-2xl md:text-4xl',
        medium: 'text-4xl md:text-6xl',
        large: 'text-5xl md:text-8xl',
      },
    },
    defaultVariants: {
      variant: 'large',
    },
  }
);

const articleChonkVariants = cva(`${chonk.className} block text-center`, {
  variants: {
    variant: {
      small: 'text-2xl md:text-4xl',
      medium: 'text-4xl md:text-6xl',
      large: 'text-5xl md:text-8xl',
    },
  },
  defaultVariants: {
    variant: 'large',
  },
});

interface ChonkProps extends VariantProps<typeof chonkVariants> {
  strings: string[];
  className?: string;
}

interface ArticleChonkProps extends VariantProps<typeof articleChonkVariants> {
  strings: string[];
  className?: string;
}

export function ChonkText({ strings, variant, className }: ChonkProps) {
  return (
    <h1 className={cn(chonkVariants({ variant }), className)}>
      {strings.map((string, index) => (
        <span key={index} className='block leading-chonk text-white'>
          {string}
        </span>
      ))}
    </h1>
  );
}
export function ArticleChonkText({
  strings,
  variant,
  className,
}: ArticleChonkProps) {
  return (
    <h1 className={cn(articleChonkVariants({ variant }), className)}>
      {strings.map((string, index) => (
        <span key={index}>{string}</span>
      ))}
    </h1>
  );
}
