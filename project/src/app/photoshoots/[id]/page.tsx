import { queryPhotoshoots } from '@/lib/supabase/model/photoshoots';
import { queryIssues } from '@/lib/supabase/model/issues';
import { getPhotoshootContributors } from '@/lib/supabase/model/photoshootContributors';
import { redirect } from 'next/navigation';
import { ImageCarousel } from '@/components/ImageCarousel';
import { PhotoshootContributorCredits } from '@/components/PhotoshootContributors';
import { ArticleChonkText } from '@/components/Chonk';
import { MONTH_NAMES } from '@/lib/supabase/model/constants';

export default async function PhotoshootPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const photoshootId = (await params).id;
  const { data, error } = await queryPhotoshoots({
    filter: {
      id: photoshootId,
    },
  });

  if (error || !data) {
    redirect('/');
  }
  const { data: pcData, error: pcError } =
    await getPhotoshootContributors(photoshootId);
  if (pcError || !pcData) {
    redirect('/');
  }

  const { data: issueData, error: issueError } = await queryIssues({
    filter: {
      id: data[0].issue_id ? data[0].issue_id : 0,
    },
  });

  if (issueError || !issueData) {
    redirect('/');
  }
  const issueDate = issueData[0].publication_date
    ? new Date(issueData[0].publication_date)
    : new Date();

  const month = MONTH_NAMES[issueDate.getMonth()].toLowerCase();
  const paddedIssueNum = issueData[0].issue_number
    ? issueData[0].issue_number.toString().padStart(4, '0.')
    : '';
  const issueTitle = issueData[0].title;
  return (
    <div className='container mx-auto px-4 py-20'>
      <ArticleChonkText strings={[data[0].title]} variant={'medium'} />
      <p className='pt-10 text-center'>
        {month} issue {paddedIssueNum}-{' '}
        <span className='font-bold'>{issueTitle}</span>
      </p>
      <ImageCarousel images={data[0].images} />
      <div>
        <PhotoshootContributorCredits pcData={pcData} />
      </div>
    </div>
  );
}
