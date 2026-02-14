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
  Pencil,
  Trash2,
  Eye,
  ArrowUpDown,
  FileText,
  ImageIcon,
} from 'lucide-react';

import type { Tables } from '@/lib/supabase/database/types';

import { deleteTagAction } from '@/actions/tags';

type Tag = Tables<'tags'>;

type SortField = 'name';
type SortDirection = 'asc' | 'desc';
type FilterTab = 'all';

export function TagTable({ tags }: { tags: Tag[] }) {
  const [items, setItems] = useState<Tag[]>(tags);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteTagAction(id);
    if (!result.success) {
      setDeleteSuccess(false);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setDeleteSuccess(true);
    }
    setShowDeleteConfirm(false);
  };

  const filteredTags = useMemo(() => {
    let filtered = items;

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
  }, [items, search, activeTab, sortField, sortDirection]);

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
        ></Tabs>
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
            <Link href={'/admin/tags/new'}>
              <Plus className='h-4 w-4' />
              <span className='hidden sm:inline'>New Tag</span>
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
              <TableHead>ID</TableHead>
              <TableHead className='w-12'>
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='h-32 text-center'>
                  <div className='text-muted-foreground flex flex-col items-center gap-2'>
                    <FileText className='h-8 w-8' />
                    <p className='text-sm'>No tags found</p>
                    <p className='text-xs'>
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTags.map((item) => {
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
                      <code className='text-muted-foreground bg-secondary rounded px-1.5 py-0.5 font-mono text-xs'>
                        {item.id}
                      </code>
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
                            <Link href={`/admin/tags/edit/${item.id}`}>
                              <Pencil className='h-4 w-4' />
                              Edit
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
                    This will permanently delete the tag: {deleteTarget?.name}.
                    This will remove ALL references to this tag. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteTarget && handleDelete(deleteTarget.id)
                    }
                    className='bg-rose-600 hover:bg-rose-700'
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableBody>
        </Table>
      </div>
      <div className='text-muted-foreground flex items-center justify-between text-sm'>
        <p>
          Showing {filteredTags.length} of {tags.length} items
        </p>
      </div>
    </div>
  );
}
