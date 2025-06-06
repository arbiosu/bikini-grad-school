import { redirect } from 'next/navigation';
import { queryArticles } from '@/lib/supabase/model/articles';
import ArticlesGrid from '@/components/Article';
import ImageOverlayCard from '@/components/ImageOverlay';
import MediaNavbar from '@/components/MediaNavbar';
import { ArticleWithContributorName } from '@/lib/supabase/model/types';

export default async function Page() {
  const { data, error } = await queryArticles({
    select: [
      '*',
      'contributorName:contributors!articles_contributor_fkey(name)',
    ],
    filter: {
      published: true,
    },
  });

  if (error || !data) {
    redirect('/error');
  }
  const articles = data as ArticleWithContributorName[];

  return (
    <section>
      <div className='py-10'></div>
      <ImageOverlayCard
        imgUrl='/photoshoots/articles-new'
        overlayText={['ARTICLES']}
        altText='Bikini Grad School: Articles'
        aspectRatio={'aspectVideo'}
        textPosition={'left'}
        textSize={'large'}
      />
      <div className='p-10'>
        <MediaNavbar />
      </div>
      <div className='container mx-auto p-6'>
        <ArticlesGrid articles={articles} />
      </div>
    </section>
  );
}
