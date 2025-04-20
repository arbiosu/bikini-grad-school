import { getIssueById, getIssueArticles } from '@/lib/supabase/model';
import { redirect } from 'next/navigation';
import { Issue } from '@/components/Issues';
import Image from '@/components/Image';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const issueId = (await params).id;
  const { data: issue, error } = await getIssueById(issueId);

  if (error || !issue) {
    redirect('/articles');
  }

  const { data: articles, error: articlesError } = await getIssueArticles(
    issue.id
  );
  if (articlesError) {
    redirect('/articles');
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='py-10'></div>
      <div className='mb-4 flex justify-center'>
        <Image
          baseUrl={issue.cover_image_path}
          alt={`Cover Image for Bikini Grad's School Issue ${issue.title}`}
          widths={['640']}
          sizes='640px'
        />
      </div>
      <Issue issue={issue} issueArticles={articles} />
    </div>
  );
}
