import ImageOverlay from '@/components/ImageOverlay';
import StaffGrid from '@/components/Staff';
import About from '@/components/About';

const staff = [
  {
    imgUrl: '/content/jayne-bgs',
    name: 'Jayne Breakfast',
    pronouns: 'she/her',
    title: 'Co-founder, Design and Media Editor',
  },
  {
    imgUrl: '/content/kelly-bgs',
    name: 'Kelly Slater',
    pronouns: 'she/her',
    title: 'Co-founder, Editorial Producer',
  },
  {
    imgUrl: '/content/jayne-bgs',
    name: 'Yasemin Tingleff',
    pronouns: 'she/they',
    title: 'Engagement and Outreach Coordinator',
  },
  {
    imgUrl: '/content/kelly-bgs',
    name: 'Billie Raposa',
    pronouns: 'they/them',
    title: 'Site and Editorial Manager',
  },
];

export default function Page() {
  return (
    <main className='container mx-auto'>
      <About />
      <ImageOverlay
        imgUrl='/content/bgs-staff'
        altText='Bikini Grad School Staff'
        overlayText={['STAFF']}
        className='mb-6 mt-10 aspect-video w-full'
        textPosition='inset-0 flex items-center justify-center'
      />
      <StaffGrid staffMembers={staff} />
    </main>
  );
}
