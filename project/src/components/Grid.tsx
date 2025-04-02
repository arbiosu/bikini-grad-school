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
  className?: string,
}

export default function Grid<T>({
  items,
  renderItem,
  columns = { base: 1, md: 3, lg: 4 },
  gap = 4,
  className = ""
}: GridProps<T>) {

  const gapClass = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  }[gap] || 'gap-4';

  const getColClass = (num: number) => {
    const colMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      12: 'grid-cols-12',
    };
    return colMap[num] || 'grid-cols-1';
  };

  return (
      <div className={cn(
        'grid',
        gapClass,
        getColClass(columns.base),
        `md:${getColClass(columns.md)}`,
        `lg:${getColClass(columns.lg)}`,
        className
      )}>
          {items.map((item, index) => (
            <Fragment key={index}>{renderItem(item)}</Fragment>
          ))}
      </div>
  );
}
