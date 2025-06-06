import { redirect } from 'next/navigation';
import { queryIssues } from '@/lib/supabase/model/issues';
import IssuesGrid from '@/components/Issues';
import ImageOverlayCard from '@/components/ImageOverlay';
import MediaNavbar from '@/components/MediaNavbar';

export default async function Page() {
  const { data: issues, error } = await queryIssues({
    filter: {
      published: true,
    },
    sort: {
      column: 'publication_date',
      order: 'desc',
    },
  });

  if (error || !issues) {
    redirect('/error');
  }

  return (
    <section>
      <div className='py-10'></div>
      <ImageOverlayCard
        imgUrl='/content/bgs-macey'
        overlayText={['PAST', 'ISSUES']}
        altText='Bikini Grad School: Past Issues'
        aspectRatio={'aspectVideo'}
        textPosition={'left'}
        textSize={'large'}
      />
      <div className='p-10'>
        <MediaNavbar />
      </div>
      <div className='container mx-auto p-10'>
        <IssuesGrid issues={issues} />
      </div>
    </section>
  );
}
