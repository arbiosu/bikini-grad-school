import { redirect } from 'next/navigation';
import { queryArticles } from '@/lib/supabase/model/articles';
import ArticlesGrid from '@/components/Article';
import ImageOverlayCard from '@/components/ImageOverlay';

export default async function Page() {
  const { data, error } = await queryArticles({
    filter: {
      published: true,
    },
  });

  if (error || !data) {
    redirect('/error');
  }

  return (
    <section>
      <div className='py-10'></div>
      <ImageOverlayCard
        imgUrl='/content/articles-bg'
        overlayText={['ARTICLES']}
        altText='Bikini Grad School: Articles'
        aspectRatio={'aspectVideo'}
        textPosition={'left'}
        textSize={'large'}
      />
      <div className='p-10'></div>
      <div className='container mx-auto'>
        <ArticlesGrid articles={data} />
      </div>
    </section>
  );
}
