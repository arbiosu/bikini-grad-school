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
  Trash2,
  Eye,
  ArrowUpDown,
  FileText,
} from 'lucide-react';

import type { ListObjectsResult } from '@/domain/storage/types';

import { deleteImageAction } from '@/actions/storage';

type SortField = 'key' | 'size';
type SortDirection = 'asc' | 'desc';
type FilterTab = 'all';

export function ImageTable({ images }: { images: ListObjectsResult[] }) {
  const [items, setItems] = useState<ListObjectsResult[]>(images);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sortField, setSortField] = useState<SortField>('key');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ListObjectsResult | null>(
    null
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (key: string) => {
    const result = await deleteImageAction(key);
    if (!result.success) {
      setDeleteSuccess(false);
    } else {
      setItems((prev) => prev.filter((item) => item.key !== key));
      setDeleteSuccess(true);
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((item) =>
        item.key.toLowerCase().includes(lowerSearch)
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
              placeholder='Search by name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-64 pl-9'
            />
          </div>

          <Button size='sm' variant={'outline'} asChild>
            <Link href={'/admin/images/new'}>
              <Plus className='h-4 w-4' />
              <span className='hidden sm:inline'>
                Upload New Standalone Image
              </span>
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
                  onClick={() => handleSort('key')}
                  className='hover:text-foreground flex items-center gap-1 transition-colors'
                >
                  Name
                  <ArrowUpDown className='h-3 w-3' />
                </button>
              </TableHead>
              <TableHead>
                {' '}
                <button
                  type='button'
                  onClick={() => handleSort('size')}
                  className='hover:text-foreground flex items-center gap-1 transition-colors'
                >
                  Size
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
                    <p className='text-sm'>No Images found</p>
                    <p className='text-xs'>
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                return (
                  <TableRow key={item.key}>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-foreground leading-snug font-medium'>
                          {item.key}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-foreground leading-snug font-medium'>
                          {Math.round(item.size / (1024 * 1024))} MB
                        </span>
                      </div>
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
                          <DropdownMenuItem asChild>
                            <Link
                              href={`${process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL}/${item.key}`}
                              prefetch={false}
                              target='_blank'
                            >
                              <Eye className='h-4 w-4' />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(item)}
                            className='text-destructive focus:text-destructive'
                          >
                            <Trash2 className='h-4 w-4' />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            <AlertDialog
              open={!!deleteTarget}
              onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete the image: {deleteTarget?.key}. This will
                    remove this image from Storage. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteTarget && handleDelete(deleteTarget.key)
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
          Showing {filteredItems.length} of {images.length} items
        </p>
      </div>
    </div>
  );
}
