import { ReactNode, Fragment } from 'react';

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
  const gridClass = `grid gap-${gap} grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg}`;
  return (
    <div className='container mx-auto'>
      <div className={gridClass}>
        {items.map((item, index) => (
          <Fragment key={index}>{renderItem(item)}</Fragment>
        ))}
      </div>
    </div>
  );
}
