import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface AdminNavCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function AdminNavCard({
  title,
  description,
  href,
  icon: Icon,
}: AdminNavCardProps) {
  return (
    <Link href={href} className='group block'>
      <Card className='hover:border-primary/40 hover:shadow-primary/5 h-full transition-all duration-200 hover:shadow-md'>
        <CardHeader className='p-5'>
          <div className='flex items-start justify-between'>
            <div className='bg-secondary group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg transition-colors'>
              <Icon className='h-5 w-5' />
            </div>
            <ArrowUpRight className='text-muted-foreground h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100' />
          </div>
          <div className='pt-3'>
            <CardTitle className='text-base font-semibold'>{title}</CardTitle>
            <CardDescription className='mt-1 text-sm leading-relaxed'>
              {description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
