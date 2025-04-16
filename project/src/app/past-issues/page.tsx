import IssuesGrid from '@/components/Issues';
import ImageOverlayCard from '@/components/ImageOverlay';

const issues = [
  {
    imgUrl: '/content/issue-5',
    issue: 'coquette',
    index: 5,
  },
  {
    imgUrl: '/content/issue-4',
    issue: 'obsession',
    index: 4,
  },
  {
    imgUrl: '/content/issue-3',
    issue: 'glam',
    index: 3,
  },
  {
    imgUrl: '/content/issue-2',
    issue: 'tis the season',
    index: 2,
  },
  {
    imgUrl: '/content/issue-1',
    issue: 'manifesto',
    index: 1,
  },
];

export default function Page() {
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
      <IssuesGrid issues={issues} />
    </main>
  );
}
