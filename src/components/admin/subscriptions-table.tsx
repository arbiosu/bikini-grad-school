'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  MoreHorizontal,
  Eye,
  ArrowUpDown,
  FileText,
} from 'lucide-react';

import type { SubscriptionWithAddons } from '@/domain/subscriptions/types';

type SortField = 'created_at' | 'updated_at' | 'current_period_start';
type SortDirection = 'asc' | 'desc';
type FilterTab =
  | 'active'
  | 'past_due'
  | 'paused'
  | 'unpaid'
  | 'canceled'
  | 'trialing'
  | 'expired'
  | 'incomplete'
  | 'incomplete_expired';

export function SubscriptionTable({
  subs,
}: {
  subs: SubscriptionWithAddons[];
}) {
  const [items, setItems] = useState<SubscriptionWithAddons[]>(subs);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('active');
  const [sortField, setSortField] = useState<SortField>('current_period_start');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((item) =>
        item.status.toLowerCase().includes(lowerSearch)
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      return String(aVal).localeCompare(String(bVal)) * multiplier;
    });

    return filtered;
  }, [[items, search, activeTab, sortField, sortDirection]]);

  const counts = useMemo(() => {
    return {
      all: items.length,
    };
  }, [items]);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FilterTab)}
        >
          {' '}
          <TabsList>
            <TabsTrigger value='all'>All ({counts.all})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Search by status...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-64 pl-9'
            />
          </div>
        </div>
      </div>

      <div className='border-border bg-card rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[35%]'>Status</TableHead>
              <TableHead>
                {' '}
                <button
                  type='button'
                  onClick={() => handleSort('current_period_start')}
                  className='hover:text-foreground flex items-center gap-1 transition-colors'
                >
                  Subscribed On:
                  <ArrowUpDown className='h-3 w-3' />
                </button>
              </TableHead>
              <TableHead className='w-12'>
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='h-32 text-center'>
                  <div className='text-muted-foreground flex flex-col items-center gap-2'>
                    <FileText className='h-8 w-8' />
                    <p className='text-sm'>No Subscriptions found</p>
                    <p className='text-xs'>
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-foreground leading-snug font-medium'>
                          {item.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{item.current_period_start}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/subscriptions/view/${item.stripe_subscription_id}`}
                              prefetch={false}
                              target='_blank'
                            >
                              <Eye className='h-4 w-4' />
                              View
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <div className='text-muted-foreground flex items-center justify-between text-sm'>
        <p>
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>
    </div>
  );
}
