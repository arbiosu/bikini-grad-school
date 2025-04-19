import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function CreateNewArticleButton() {
  return (
    <Link href='/admin/create'>
      <Button>
        <PlusCircle />
        {'Create New Article'}
      </Button>
    </Link>
  );
}
