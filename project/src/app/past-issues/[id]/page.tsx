import { redirect } from 'next/navigation';
import { queryIssues } from '@/lib/supabase/model/issues';
import { queryArticles } from '@/lib/supabase/model/articles';
import { Issue } from '@/components/Issues';
import Image from '@/components/Image';
import { queryPhotoshoots } from '@/lib/supabase/model/photoshoots';

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const issueId = (await params).id;
  const { data: issue, error } = await queryIssues({
    filter: {
      id: issueId,
    },
  });

  if (error || !issue) {
    redirect('/past-issues');
  }

  const {
    data: articles,
    count: articleCount,
    error: articlesError,
  } = await queryArticles({
    count: 'exact',
    filter: {
      issueId: issueId,
    },
  });
  const {
    data: photoshoots,
    count: photoshootCount,
    error: photoshootError,
  } = await queryPhotoshoots({
    count: 'exact',
    filter: {
      issueId: issueId,
    },
  });
  console.log('todo implement count', articleCount, photoshootCount);

  if (articlesError || !articles || photoshootError || !photoshoots) {
    redirect('/past-issues');
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='py-10'></div>
      <div className='mb-4 flex justify-center'>
        <Image
          baseUrl={issue[0].cover_image_path}
          alt={`Cover Image for Bikini Grad's School Issue ${issue[0].title}`}
          widths={['640']}
          sizes='640px'
        />
      </div>
      <Issue
        issue={issue[0]}
        issueArticles={articles}
        issuePhotoshoots={photoshoots}
      />
    </div>
  );
}
