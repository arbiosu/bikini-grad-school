'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  ArrowUpDown,
  FileText,
} from 'lucide-react';

import type { TierWithPrices } from '@/domain/subscriptions/types';

import { deactivateTierAction } from '@/actions/subscriptions/tiers';

type SortField = 'name' | 'created_at' | 'updated_at' | 'addon_slots';
type SortDirection = 'asc' | 'desc';
type FilterTab = 'all' | 'active' | 'disabled';

function getActiveStatus(item: TierWithPrices) {
  if (item.is_active === true) return 'active' as const;
  if (item.is_active === false) return 'disabled' as const;
  return 'disabled' as const;
}

const activeStatusConfig = {
  active: {
    label: 'Active',
    className:
      'border-primary/30 bg-primary/10 text-primary hover:bg-primary/10',
  },
  disabled: {
    label: 'Disabled',
    className:
      'border-border bg-secondary text-secondary-foreground hover:bg-secondary',
  },
};

export function TierTable({ tiers }: { tiers: TierWithPrices[] }) {
  const [items, setItems] = useState<TierWithPrices[]>(tiers);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showDeactivateConfirm, setShowDeactivateConfirm] =
    useState<boolean>(false);
  const [deactivateSuccess, setDeactivateSuccess] = useState<boolean | null>(
    null
  );
  const [deactivateTarget, setDeactivateTarget] =
    useState<TierWithPrices | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeactivate = async (id: string) => {
    const result = await deactivateTierAction(id);
    if (!result.success) {
      setDeactivateSuccess(true);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setDeactivateSuccess(true);
    }
  };

  const filteredTiers = useMemo(() => {
    let filtered = items;

    if (activeTab === 'active') {
      filtered = filtered.filter((item) => item.is_active === true);
    } else if (activeTab === 'disabled') {
      filtered = filtered.filter((item) => item.is_active === false);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(lowerSearch)
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
      active: items.filter((i) => i.is_active === true).length,
      disabled: items.filter((i) => i.is_active === false).length,
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
            <TabsTrigger value='active'>Active ({counts.active})</TabsTrigger>
            <TabsTrigger value='disabled'>
              Disabled ({counts.disabled})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Search by name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-64 pl-9'
            />
          </div>

          <Button size='sm' variant={'outline'} asChild>
            <Link href={'/admin/subscriptions/tiers/new'}>
              <Plus className='h-4 w-4' />
              <span className='hidden sm:inline'>New Subscription Tier</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className='border-border bg-card rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[35%]'>
                <button
                  type='button'
                  onClick={() => handleSort('name')}
                  className='hover:text-foreground flex items-center gap-1 transition-colors'
                >
                  Name
                  <ArrowUpDown className='h-3 w-3' />
                </button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Add On Slots</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <button
                  type='button'
                  onClick={() => handleSort('name')}
                  className='hover:text-foreground flex items-center gap-1 transition-colors'
                >
                  Created At
                </button>
              </TableHead>
              <TableHead>
                <button
                  type='button'
                  onClick={() => handleSort('name')}
                  className='hover:text-foreground flex items-center gap-1 transition-colors'
                >
                  Updated At
                </button>
              </TableHead>
              <TableHead className='w-12'>
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTiers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='h-32 text-center'>
                  <div className='text-muted-foreground flex flex-col items-center gap-2'>
                    <FileText className='h-8 w-8' />
                    <p className='text-sm'>No tiers found</p>
                    <p className='text-xs'>
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTiers.map((item) => {
                const status = getActiveStatus(item);
                const statusStyle = activeStatusConfig[status];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-foreground leading-snug font-medium'>
                          {item.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-foreground leading-snug font-medium'>
                          {item.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      <code className='text-muted-foreground bg-secondary rounded px-1.5 py-0.5 font-mono text-xs'>
                        {item.addon_slots}
                      </code>
                    </TableCell>
                    <TableCell>{item.prices[0].amount}</TableCell>
                    <TableCell>{item.prices[0].interval}</TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={statusStyle.className}
                      >
                        {statusStyle.label}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground hidden text-sm md:table-cell'>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )
                        : '--'}
                    </TableCell>
                    <TableCell className='text-muted-foreground hidden text-sm md:table-cell'>
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )
                        : '--'}
                    </TableCell>
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
                          <DropdownMenuItem>
                            <Eye className='h-4 w-4' />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/subscriptions/tiers/edit/${item.id}`}
                            >
                              <Pencil className='h-4 w-4' />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeactivateTarget(item)}
                            className='text-destructive focus:text-destructive'
                          >
                            <Trash2 className='h-4 w-4' />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            <AlertDialog
              open={!!deactivateTarget}
              onOpenChange={(open) => !open && setDeactivateTarget(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will deactivate the tier: {deactivateTarget?.name}.
                    This will remove this subscription tier from the shop list,
                    as well as interfere with any current subscribers. Ensure
                    you have talked and have a plan about what to do to current
                    subscribers before proceeding with deactivation.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deactivateTarget && handleDeactivate(deactivateTarget.id)
                    }
                    className='bg-rose-600 hover:bg-rose-700'
                  >
                    Deactivate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableBody>
        </Table>
      </div>
      <div className='text-muted-foreground flex items-center justify-between text-sm'>
        <p>
          Showing {filteredTiers.length} of {tiers.length} items
        </p>
      </div>
    </div>
  );
}
