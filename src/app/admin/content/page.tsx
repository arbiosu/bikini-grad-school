import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/admin/back-button';

export default async function Page() {
  // TODO: protect route
  return (
    <section className='mx-auto max-w-7xl'>
      <div className='flex gap-8'>
        <BackButton href='/admin' label='Back' />
        <h1 className='text-center text-2xl font-bold underline'>
          Admin Portal - Content
        </h1>
      </div>

      <div className='grid grid-cols-2 gap-8 p-4'>
        <div className='grid max-w-xl gap-4'>
          <p className='text-center text-2xl font-bold'>Create</p>
          <Button asChild className='bg-violet-800 text-white'>
            <Link href='/admin/content/new'>Create New Content</Link>
          </Button>
          <Button asChild className='bg-violet-800 text-white'>
            <Link href='/admin/content/issues/new'>Create New Issue</Link>
          </Button>
          <Button asChild className='bg-violet-800 text-white'>
            <Link href='/admin/content/tags/new'>Create New Tag</Link>
          </Button>
          <Button asChild className='bg-violet-800 text-white'>
            <Link href='/admin/content/images/new'>Upload New Image</Link>
          </Button>
        </div>
        <div className='grid max-w-xl gap-4'>
          <p className='text-center text-2xl font-bold'>Manage</p>
          <Button asChild className='bg-blue-800 text-white'>
            <Link href='/admin/content/manage'>Manage Content</Link>
          </Button>
          <Button asChild className='bg-blue-800 text-white'>
            <Link href='/admin/content/issues/manage'>Manage Issues</Link>
          </Button>
          <Button asChild className='bg-blue-800 text-white'>
            <Link href='/admin/content/tags/manage'>Manage Tags</Link>
          </Button>
          <Button asChild className='bg-blue-800 text-white'>
            <Link href='/admin/content/images/manage'>Manage Images</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
