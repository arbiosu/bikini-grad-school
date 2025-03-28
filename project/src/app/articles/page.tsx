import { ArticlePreview } from '@/components/Articles';
import { getArticles } from '@/lib/supabase/model';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { data, error } = await getArticles();
  if (error) {
    redirect('/admin/error');
  }

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-5xl font-bold text-custom-pink-text'>
        Articles
      </h1>
      <div className='grid gap-8 md:grid-cols-2'>
        {data.map((article) => (
          <ArticlePreview key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}
