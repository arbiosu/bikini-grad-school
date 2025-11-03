import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <section>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl'>Admin Portal - Content - Manage Issues</h1>
      </div>
      <div className='flex justify-center'>
        <Button asChild variant={'outline'}>
          <Link href='/admin/content/issues/new'>Create a New Issue</Link>
        </Button>
      </div>
    </section>
  );
}
