import Link from 'next/link';
import { Shield, ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  breadcrumbs?: Breadcrumb[];
}

export function AdminHeader({ breadcrumbs }: AdminHeaderProps) {
  return (
    <header className='border-border bg-card border-b'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8'>
        <div className='flex items-center gap-3'>
          <Link
            href='/admin'
            className='bg-primary flex h-9 w-9 items-center justify-center rounded-lg transition-opacity hover:opacity-90'
          >
            <Shield className='text-primary-foreground h-5 w-5' />
          </Link>
          <div className='flex items-center gap-1.5'>
            <Link
              href='/admin'
              className='text-foreground hover:text-foreground/80 text-lg font-semibold tracking-tight transition-colors'
            >
              BGS Admin
            </Link>
            {breadcrumbs?.map((crumb) => (
              <span key={crumb.label} className='flex items-center gap-1.5'>
                <ChevronRight className='text-muted-foreground h-3.5 w-3.5' />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className='text-foreground text-sm'>{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
