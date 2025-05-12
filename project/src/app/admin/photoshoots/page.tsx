import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { queryPhotoshoots } from '@/lib/supabase/model/photoshoots';
import PhotoshootsAdminGrid from '@/components/admin/Photoshoot';
import LinkButton from '@/components/admin/LinkButton';
import { ArrowLeft } from 'lucide-react';

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log('Auth Error:', error);
    redirect('/admin/login');
  }

  const {
    data: photoshoots,
    count,
    error: dbError,
  } = await queryPhotoshoots({
    count: 'exact',
  });

  if (dbError || !photoshoots) {
    console.log(error);
    return (
      <h1 className='text-center text-2xl'>Failed to retireve photoshoots</h1>
    );
  }

  return (
    <div className='container mx-auto p-20'>
      <h1 className='mx-4 text-center text-5xl font-bold'>
        Admin Dashboard - Total Photoshoots {count}
      </h1>
      <div className='p-2'>
        <LinkButton
          href={'/admin'}
          label='Back to Admin Dashboard'
          Icon={ArrowLeft}
        />
      </div>
      <PhotoshootsAdminGrid photoshoots={photoshoots} />
    </div>
  );
}
