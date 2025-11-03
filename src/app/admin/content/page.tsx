import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Page() {
  // TODO: protect route
  return (
    <section>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl'>Admin Portal - Content</h1>
      </div>
      <div className='p-2'></div>
      <div className='flex justify-center gap-8'>
        <Button asChild variant={'outline'} className='bg-green-400'>
          <Link href='/admin/content/new'>Create New Content</Link>
        </Button>
        <Button asChild variant={'outline'}>
          <Link href='/admin/content/issues'>Manage Issues</Link>
        </Button>
        <Button asChild variant={'outline'}>
          <Link href='/admin/content/articles'>Manage Articles</Link>
        </Button>
        <Button asChild variant={'outline'}>
          <Link href='/admin/content/features'>Manage Features</Link>
        </Button>
        <Button asChild variant={'outline'}>
          <Link href='/admin/content/interviews'>Manage Interviews</Link>
        </Button>
        <Button asChild variant={'outline'}>
          <Link href='/admin/content/tags'>Manage Content Tags</Link>
        </Button>
      </div>
    </section>
  );
}
