import ImageTextGrid from '@/components/ImageGrid';
import IssuesGrid from '@/components/PastIssuesGrid';

const issues = [
  {
    imgUrl: '/issue-5.png',
    issue: 'issue .05 coquette',
  },
  {
    imgUrl: '/issue-4.png',
    issue: 'issue .04 obsession',
  },
  {
    imgUrl: '/issue-3.png',
    issue: 'issue .03 glam',
  },
  {
    imgUrl: '/issue-2.png',
    issue: 'issue .02 tis the season',
  },
  {
    imgUrl: '/issue-1.png',
    issue: 'issue .01 manifesto',
  },
];

export default function Page() {
  return (
    <div className='container mx-auto py-20'>
      <ImageTextGrid
        imgUrl='/past-issues-transparent.png'
        first='PAST'
        second='ISSUES'
      />
      <IssuesGrid issues={issues} />
    </div>
  );
}
