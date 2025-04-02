import IssuesGrid from '@/components/PastIssuesGrid';
import ImageOverlayCard from '@/components/ImageOverlay';

const issues = [
  {
    imgUrl: '/content/issue-5',
    issue: 'issue .05 coquette',
  },
  {
    imgUrl: '/content/issue-4',
    issue: 'issue .04 obsession',
  },
  {
    imgUrl: '/content/issue-3',
    issue: 'issue .03 glam',
  },
  {
    imgUrl: '/content/issue-2',
    issue: 'issue .02 tis the season',
  },
  {
    imgUrl: '/content/issue-1',
    issue: 'issue .01 manifesto',
  },
];

export default function Page() {
  return (
    <div className='container mx-auto py-20'>
      <ImageOverlayCard
        imgUrl='/content/bgs-macey'
        overlayText={['PAST', 'ISSUES']}
        altText='Bikini Grad School: Past Issues'
        className='mb-6 mt-10 aspect-video w-full'
        textPosition='left-0 top-0'
      />
      <IssuesGrid issues={issues} />
    </div>
  );
}
