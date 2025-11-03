import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Page() {
  // TODO: protect route
  return (
    <section>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl'>Admin Portal</h1>
        <p className='font-bold underline'>Manage all BGS content here!</p>
      </div>
      <div className='p-8'></div>
      <div className='flex justify-center gap-8'>
        <Button asChild variant={'outline'}>
          <Link href='/admin/content'>Manage Content</Link>
        </Button>
        <Button asChild variant={'outline'}>
          <Link href='/admin/contributors'>Manage Contributors</Link>
        </Button>
        <Button asChild variant={'outline'}>
          <Link href='/admin/roles'>Manage Creative Roles</Link>
        </Button>
      </div>
    </section>
  );
}
