import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/admin/SignOut';
import LinkButton from '@/components/admin/LinkButton';
import { Newspaper, ScrollText, PlusCircle } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log('Auth Error:', error);
    redirect('/admin/login');
  }

  return (
    <div className='container mx-auto p-20'>
      <h1 className='mx-4 text-center text-5xl font-bold'>Admin Dashboard</h1>
      <div className='flex flex-col gap-10 p-10'>
        <LinkButton
          href={'/admin/issues'}
          label={'View/Edit Issues'}
          Icon={ScrollText}
        />
        <LinkButton
          href={'/admin/articles'}
          label={'View/Edit Articles'}
          Icon={Newspaper}
        />
        <LinkButton
          href={'/admin/contributors'}
          label={'View/Edit Contributors'}
          Icon={ScrollText}
        />
        <LinkButton
          href={'/admin/photoshoots'}
          label={'View/Edit Photoshoots'}
          Icon={ScrollText}
        />
        <LinkButton
          href={'/admin/issues/create'}
          label={'Create New Issue'}
          Icon={PlusCircle}
        />
        <LinkButton
          href={'/admin/articles/create'}
          label={'Create New Article'}
          Icon={PlusCircle}
        />
        <LinkButton
          href={'/admin/contributors/create'}
          label={'Create New Contributor'}
          Icon={PlusCircle}
        />
        <LinkButton
          href={'/admin/photoshoots/create'}
          label={'Create New Photoshoot'}
          Icon={PlusCircle}
        />

        <SignOutButton />
      </div>
    </div>
  );
}
