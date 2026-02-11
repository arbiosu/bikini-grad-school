'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
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

import type { Tables } from '@/lib/supabase/database/types';

import { deleteContentAction } from '@/actions/contents';

type ContentType = 'article' | 'feature' | 'interview' | 'digi_media';

type Content = Tables<'contents'>;

const typeConfig: Record<ContentType, { label: string; className: string }> = {
  article: {
    label: 'Article',
    className:
      'border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/10',
  },
  feature: {
    label: 'Feature',
    className:
      'border-primary/30 bg-primary/10 text-primary hover:bg-primary/10',
  },
  interview: {
    label: 'Interview',
    className:
      'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/10',
  },
  digi_media: {
    label: 'Digi Media',
    className:
      'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/10',
  },
};

function getPublishStatus(item: Content) {
  if (item.published === true) return 'published' as const;
  if (item.published === false) return 'draft' as const;
  return 'draft' as const;
}

const publishStatusConfig = {
  published: {
    label: 'Published',
    className:
      'border-primary/30 bg-primary/10 text-primary hover:bg-primary/10',
  },
  draft: {
    label: 'Draft',
    className:
      'border-border bg-secondary text-secondary-foreground hover:bg-secondary',
  },
};

type SortField = 'title' | 'slug' | 'updated_at' | 'issue_id';
type SortDirection = 'asc' | 'desc';
type FilterTab =
  | 'all'
  | 'published'
  | 'draft'
  | 'article'
  | 'feature'
  | 'interview';

export function ContentTable({ content }: { content: Content[] }) {
  const [items, setItems] = useState<Content[]>(content);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Content | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteContentAction(id);
    if (!result.success) {
      setDeleteSuccess(false);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setDeleteSuccess(true);
    }
    setShowDeleteConfirm(false);
  };

  const filteredContent = useMemo(() => {
    let filtered = items;

    if (activeTab === 'published') {
      filtered = filtered.filter((item) => item.published === true);
    } else if (activeTab === 'draft') {
      filtered = items.filter((item) => item.published !== true);
    } else if (
      activeTab === 'article' ||
      activeTab === 'feature' ||
      activeTab === 'interview'
    ) {
      filtered = items.filter((item) => item.type === activeTab);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerSearch) ||
          item.slug.toLowerCase().includes(lowerSearch) ||
          (item.summary?.toLowerCase().includes(lowerSearch) ?? false) ||
          item.type.toLowerCase().includes(lowerSearch)
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'issue_id') {
        return (a.issue_id - b.issue_id) * multiplier;
      }
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      return String(aVal).localeCompare(String(bVal)) * multiplier;
    });

    return filtered;
  }, [items, search, activeTab, sortField, sortDirection]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      published: items.filter((i) => i.published === true).length,
      draft: items.filter((i) => i.published !== true).length,
    };
  }, [items]);

  return (
    <div className='flex flex-col gap-6'>
      {/* Toolbar */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FilterTab)}
        >
          <TabsList>
            <TabsTrigger value='all'>All ({counts.all})</TabsTrigger>
            <TabsTrigger value='published'>
              Published ({counts.published})
            </TabsTrigger>
            <TabsTrigger value='draft'>
              Unpublished ({counts.draft})
            </TabsTrigger>
            <TabsTrigger value='article'>Articles</TabsTrigger>
            <TabsTrigger value='feature'>Features</TabsTrigger>
            <TabsTrigger value='interview'>Interviews</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Search by title, slug...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-64 pl-9'
            />
          </div>

          <Button size='sm' variant={'outline'} asChild>
            <Link href={'/admin/content/new'}>
              <Plus className='h-4 w-4' />
              <span className='hidden sm:inline'>New Content</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='border-border bg-card rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[35%]'>
                <button
                  type='button'
                  onClick={() => handleSort('title')}
                  className='hover:text-foreground flex items-center gap-1 transition-colors'
                >
                  Title
                  <ArrowUpDown className='h-3 w-3' />
                </button>
              </TableHead>
              <TableHead className='hidden lg:table-cell'>
                <button
                  type='button'
                  onClick={() => handleSort('slug')}
                  className='hover:text-foreground flex items-center gap-1 transition-colors'
                >
                  Slug
                  <ArrowUpDown className='h-3 w-3' />
                </button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <button
                  type='button'
                  onClick={() => handleSort('issue_id')}
                  className='hover:text-foreground flex items-center gap-1 transition-colors'
                >
                  Issue
                  <ArrowUpDown className='h-3 w-3' />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='hidden md:table-cell'>Cover</TableHead>
              <TableHead className='hidden md:table-cell'>
                <button
                  type='button'
                  onClick={() => handleSort('updated_at')}
                  className='hover:text-foreground flex items-center gap-1 transition-colors'
                >
                  Updated
                  <ArrowUpDown className='h-3 w-3' />
                </button>
              </TableHead>
              <TableHead className='w-12'>
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContent.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='h-32 text-center'>
                  <div className='text-muted-foreground flex flex-col items-center gap-2'>
                    <FileText className='h-8 w-8' />
                    <p className='text-sm'>No content found</p>
                    <p className='text-xs'>
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredContent.map((item) => {
                const status = getPublishStatus(item);
                const statusStyle = publishStatusConfig[status];
                const typeStyle = typeConfig[item.type];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-foreground leading-snug font-medium'>
                          {item.title}
                        </span>
                        {item.summary && (
                          <span className='text-muted-foreground line-clamp-1 text-xs'>
                            {item.summary}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell'>
                      <code className='text-muted-foreground bg-secondary rounded px-1.5 py-0.5 font-mono text-xs'>
                        {item.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className={typeStyle.className}>
                        {typeStyle.label}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm tabular-nums'>
                      ID #{item.issue_id}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={statusStyle.className}
                      >
                        {statusStyle.label}
                      </Badge>
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      {item.cover_image_url ? (
                        <span className='text-primary flex items-center gap-1 text-xs'>
                          <ImageIcon className='h-3 w-3' />
                          Yes
                        </span>
                      ) : (
                        <span className='text-muted-foreground text-xs'>
                          None
                        </span>
                      )}
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
                            <Link href={`/admin/content/edit/${item.id}`}>
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
                    This will permanently delete the content:{' '}
                    {deleteTarget?.title}. This will remove ALL references to
                    this content. This action cannot be undone.
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

      {/* Footer */}
      <div className='text-muted-foreground flex items-center justify-between text-sm'>
        <p>
          Showing {filteredContent.length} of {content.length} items
        </p>
        <p className='hidden sm:block'>
          {filteredContent.filter((i) => i.published === true).length} published
          &middot; {filteredContent.filter((i) => i.cover_image_url).length}{' '}
          with cover images
        </p>
      </div>
    </div>
  );
}
