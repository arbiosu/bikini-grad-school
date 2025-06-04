import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAllImagesInFolder } from '@/lib/supabase/model/storage';

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log('Auth Error:', error);
    redirect('/admin/login');
  }
  const articles = await getAllImagesInFolder('articles');
  const content = await getAllImagesInFolder('content');
  const photoshoots = await getAllImagesInFolder('photoshoots');
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images`;

  return (
    <section className='mx-auto p-10'>
      <div className='grid p-10 md:grid-cols-3'>
        <div>
          <h3 className='text-2xl'>Articles: </h3>
          {articles.data?.map((image) => (
            <Link
              key={image.id}
              href={`${url}/articles/${image.name}`}
              prefetch={false}
              className='line-clamp-1 text-sm hover:underline'
            >
              articles/{image.name}
            </Link>
          ))}
        </div>
        <div>
          <h3 className='text-2xl'>Content: </h3>
          {content.data?.map((image) => (
            <div key={image.id}>
              <Link
                href={`${url}/content/${image.name}`}
                prefetch={false}
                className='line-clamp-1 text-sm hover:underline'
              >
                content/{image.name}
              </Link>
            </div>
          ))}
        </div>
        <div>
          <h3 className='text-2xl'>Photoshoots: </h3>
          {photoshoots.data?.map((image) => (
            <Link
              key={image.id}
              href={`${url}/photoshoots/${image.name}`}
              prefetch={false}
              className='line-clamp-1 text-sm hover:underline'
            >
              photoshoots/{image.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
