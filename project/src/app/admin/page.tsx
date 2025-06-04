import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/admin/SignOut';
import LinkButton from '@/components/admin/LinkButton';
import { Separator } from '@/components/ui/separator';
import {
  Newspaper,
  ScrollText,
  PlusCircle,
  Image,
  FileText,
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log('Auth Error:', error);
    redirect('/admin/login');
  }

  return (
    <div className='container mx-auto px-4 py-20 md:px-6'>
      <h1 className='mb-10 text-center text-4xl font-bold md:text-5xl'>
        Admin Dashboard
      </h1>

      <div className='grid gap-10'>
        {/* Content Management Section */}
        <section>
          <h2 className='mb-4 text-2xl font-semibold'>Content Management</h2>
          <Separator className='mb-6' />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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
              Icon={FileText}
            />
            <LinkButton
              href={'/admin/photoshoots'}
              label={'View/Edit Photoshoots'}
              Icon={Image}
            />
          </div>
        </section>

        {/* Content Creation Section */}
        <section>
          <h2 className='mb-4 text-2xl font-semibold'>Create New Content</h2>
          <Separator className='mb-6' />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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
          </div>
        </section>

        {/* Media Management Section */}
        <section>
          <h2 className='mb-4 text-2xl font-semibold'>Media Management</h2>
          <Separator className='mb-6' />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <LinkButton
              href={'/admin/image'}
              label={'Upload Standalone Image'}
              Icon={Image}
            />
            <LinkButton
              href={'/admin/bucket'}
              label={'View All Images'}
              Icon={Image}
            />
          </div>
        </section>

        {/* Account Management Section */}
        <section className='mt-6 flex justify-center'>
          <SignOutButton />
        </section>
      </div>
    </div>
  );
}
