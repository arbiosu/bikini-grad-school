import { ReactNode, Fragment } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const gridVariants = cva(
  'grid',
  {
    variants: {
      variant: {
        default:
          'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2',
        small:
          'grid-cols-1 md:grid-cols-2 gap-8'
      }
    },
    defaultVariants: {
      variant: 'default',
    }
  }
);

interface GridProps<T> extends VariantProps<typeof gridVariants> {
  items: T[];
  renderItem: (item: T) => ReactNode;  
}

export default function Grid<T>({
  items,
  renderItem,
  variant,
}: GridProps<T>) {

  return (
      <div className={cn(gridVariants({ variant }))}>
          {items.map((item, index) => (
            <Fragment key={index}>{renderItem(item)}</Fragment>
          ))}
      </div>
  );
}
