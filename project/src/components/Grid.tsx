import { ReactNode, Fragment } from 'react';
import { cn } from '@/lib/utils';

interface GridProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  columns?: {
    base: number;
    md: number;
    lg: number;
  };
  gap?: number;
}

export default function Grid<T>({
  items,
  renderItem,
  columns = { base: 1, md: 3, lg: 4 },
  gap = 4,
}: GridProps<T>) {
  return (
      <div className={cn(
        'grid',
        `gap-${gap}`,
        `grid-cols-${columns.base}`,
        `md:grid-cols-${columns.md}`,
        `lg:grid-cols-${columns.lg}`
      )}>
          {items.map((item, index) => (
            <Fragment key={index}>{renderItem(item)}</Fragment>
          ))}
      </div>
  );
}
