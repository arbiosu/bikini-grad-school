import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LinkButton from '@/components/admin/LinkButton';
import { ArrowLeft } from 'lucide-react';
import UploadStandaloneImage from '@/components/admin/UploadStandaloneImage';

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log('Auth Error:', error);
    redirect('/admin/login');
  }

  return (
    <div className='container mx-auto p-20'>
      <h1 className='mx-4 text-center text-5xl font-bold'>
        Admin Dashboard - Standalone Image Upload
      </h1>
      <div className='p-2'>
        <LinkButton
          href={'/admin'}
          label='Back to Admin Dashboard'
          Icon={ArrowLeft}
        />
      </div>
      <UploadStandaloneImage />
    </div>
  );
}
