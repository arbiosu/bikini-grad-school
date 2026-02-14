import { type LucideIcon } from 'lucide-react';

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
}

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className='border-border bg-card flex items-center gap-3 rounded-lg border px-4 py-3'
          >
            <Icon className='text-muted-foreground h-4 w-4' />
            <div>
              <p className='text-foreground text-lg font-semibold'>
                {stat.value}
              </p>
              <p className='text-muted-foreground text-xs'>{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
