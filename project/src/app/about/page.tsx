import ImageOverlay from '@/components/ImageOverlay';
import StaffGrid from '@/components/Staff';
import About from '@/components/About';
import DonationSection from '@/components/Donations';
const staff = [
  {
    imgUrl: '/content/jayne-staff-star',
    name: 'jayne breakfast',
    pronouns: 'she/her',
    title: 'Co-founder, Design and Media Editor',
  },
  {
    imgUrl: '/content/kelly-staff-star',
    name: 'kelly slater',
    pronouns: 'she/her',
    title: 'Co-founder, Editorial Producer',
  },
  {
    imgUrl: '/content/rachel-staff-star',
    name: 'rachel west',
    pronouns: 'she/her',
    title: 'Lead Contributor',
  },
  {
    imgUrl: '/content/yasemin-staff-star',
    name: 'yasemin tingleff',
    pronouns: 'she/they',
    title: 'Engagement and Outreach Coordinator',
  },
];

export default function Page() {
  return (
    <section>
      <About />
      <ImageOverlay
        imgUrl='/content/staff-photo-header'
        altText='Bikini Grad School Staff'
        overlayText={['STAFF']}
        aspectRatio={'aspectVideo'}
        textPosition={'center'}
        textSize={'large'}
      />
      <div className='p-10'>
        <StaffGrid staffMembers={staff} />
      </div>

      <DonationSection />
    </section>
  );
}
