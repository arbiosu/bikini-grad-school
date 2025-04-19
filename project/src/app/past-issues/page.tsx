import { getAllIssues } from '@/lib/supabase/model';
import IssuesGrid from '@/components/Issues';
import ImageOverlayCard from '@/components/ImageOverlay';

export default async function Page() {
  const { data, error } = await getAllIssues();

  if (error) {
    return <h1>Unable to retrieve Issues</h1>;
  }

  return (
    <main className='container mx-auto'>
      <div className='py-10'></div>
      <ImageOverlayCard
        imgUrl='/content/bgs-macey'
        overlayText={['PAST', 'ISSUES']}
        altText='Bikini Grad School: Past Issues'
        aspectRatio={'aspectVideo'}
        textPosition={'left'}
        textSize={'large'}
      />
      <div className='py-10'></div>
      <IssuesGrid issues={data} />
    </main>
  );
}
