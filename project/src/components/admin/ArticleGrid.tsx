import { getAllArticles } from '@/lib/supabase/model';
import { ArticleAdminCard } from './Article';
import Grid from '@/components/Grid';

export default async function ArticleAdminGrid() {
  const { data, error } = await getAllArticles();

  if (error) {
    return (
      <h1 className='text-xl'>Error retrieving articles from database.</h1>
    );
  }

  return (
    <Grid
      items={data}
      renderItem={(article) => <ArticleAdminCard {...article} />}
    />
  );
}
