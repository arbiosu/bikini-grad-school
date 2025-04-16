import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('text-center tracking-tighter text-balance', {
  variants: {
    headingSize: {
      xsmall: 'text-sm md:text-lg',
      small: 'text-xl md:text-2xl',
      medium: 'text-2xl md:text-4xl',
      large: 'text-4xl md:text-6xl',
    },
  },
  defaultVariants: {
    headingSize: 'large',
  },
});

const subheadingVariants = cva(
  'text-balance text-center text-muted-foreground',
  {
    variants: {
      subheadingSize: {
        small: 'text-sm md:text-lg',
        medium: 'text-xl md:text-2xl',
        large: 'text-2xl md:text-4xl',
      },
    },
    defaultVariants: {
      subheadingSize: 'small',
    },
  }
);

interface TextBlockProps
  extends VariantProps<typeof headingVariants>,
    VariantProps<typeof subheadingVariants> {
  heading: string;
  subheading: string;
}

export default function TextBlock({
  heading,
  subheading,
  headingSize,
  subheadingSize,
}: TextBlockProps) {
  return (
    <div className='h-full w-full p-10 md:p-14'>
      <div className='mx-auto flex max-w-xl flex-col items-center justify-center gap-2'>
        <h2 className={cn(headingVariants({ headingSize }))}>{heading}</h2>
        <p className={cn(subheadingVariants({ subheadingSize }))}>
          {subheading}
        </p>
      </div>
    </div>
  );
}
