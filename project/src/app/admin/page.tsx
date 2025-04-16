import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { SignOutForm } from '@/components/Admin';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArticleList, ContributeMessageList } from '@/components/AdminLists';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log('Auth Error:', error);
    redirect('/admin/login');
  }

  return (
    <div className='container mx-auto p-4'>
      <div>
        <h1 className='mx-4 text-5xl font-bold'>Admin Dashboard</h1>
        <ArticleList />
      </div>
      <div>
        <h2 className='mx-4 text-5xl font-bold text-custom-pink-text'>
          Contribute Messages
        </h2>
        <ContributeMessageList />
      </div>
      <div className='mx-3 flex gap-10'>
        <Link href='/admin/create'>
          <Button>
            <PlusCircle />
            {'Create New Article'}
          </Button>
        </Link>
        <SignOutForm />
      </div>
    </div>
  );
}
