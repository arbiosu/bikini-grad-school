import { redirect } from 'next/navigation';
import { queryContents } from '@/lib/supabase/model/contents';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;
  const { data, error } = await queryContents({
    filter: {
      id: id,
    },
  });
  if (error || !data) {
    redirect('/admin/error');
  }
  console.log(data);

  return <section>View working</section>;
}
