import { ReactNode, Fragment } from 'react';

interface GridProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
}

export default function Grid<T>({ items, renderItem }: GridProps<T>) {
  return (
    <div className='container mx-auto'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {items.map((item, index) => (
          <Fragment key={index}>{renderItem(item)}</Fragment>
        ))}
      </div>
    </div>
  );
}
