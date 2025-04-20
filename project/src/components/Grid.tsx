import { ReactNode, Fragment } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const gridVariants = cva('grid', {
  variants: {
    variant: {
      default: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2',
      small: 'grid-cols-1 md:grid-cols-2 gap-8',
      medium: 'grid cols-a md:grid-cols-3 gap-8',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface GridProps<T> extends VariantProps<typeof gridVariants> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}

export default function Grid<T>({
  items,
  renderItem,
  variant,
  className = '',
}: GridProps<T>) {
  if (items.length === 0) {
    return <p className='text-xl'>Empty</p>;
  }

  return (
    <div className={cn(gridVariants({ variant }), className)}>
      {items.map((item, index) => (
        <Fragment key={index}>{renderItem(item, index)}</Fragment>
      ))}
    </div>
  );
}
