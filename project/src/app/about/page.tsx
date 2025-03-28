import { AboutUsBook } from '@/components/About';
import { PictureDivider } from '@/components/PictureDivider';
import StaffGrid from '@/components/Staff';

const staff = [
  {
    imgUrl: '/jayne-bgs.png',
    name: 'Jayne Breakfast',
    pronouns: 'she/her',
    title: 'Co-founder, Design and Media Editor',
  },
  {
    imgUrl: '/kelly-bgs.png',
    name: 'Kelly Slater',
    pronouns: 'she/her',
    title: 'Co-founder, Editorial Producer',
  },
  {
    imgUrl: '/jayne-bgs.png',
    name: 'Yasemin Tingleff',
    pronouns: 'she/they',
    title: 'Engagement and Outreach Coordinator',
  },
  {
    imgUrl: '/kelly-bgs.png',
    name: 'Billie Raposa',
    pronouns: 'they/them',
    title: 'Site and Editorial Manager',
  },
];

export default function About() {
  return (
    <main className=''>
      <AboutUsBook />
      <PictureDivider imgUrl='/bgs-staff.png' text='Staff' />
      <StaffGrid staffMembers={staff} />
    </main>
  );
}
