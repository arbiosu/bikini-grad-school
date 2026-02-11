import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PhotoHeader from '@/components/layout/photo-header';

interface StaffProps {
  src: string;
  name: string;
  pronouns: string;
  title: string;
}

export default function Page() {
  const staff: StaffProps[] = [
    {
      src: '/jayne-staff-star.png',
      name: 'jayne breakfast',
      pronouns: 'she/her',
      title: 'Co-founder, Design and Media Editor',
    },
    {
      src: '/kelly-staff-star.png',
      name: 'kelly slater',
      pronouns: 'she/her',
      title: 'Co-founder, Editorial Producer',
    },
    {
      src: '/rachel-staff-star.png',
      name: 'rachel west',
      pronouns: 'she/her',
      title: 'Lead Contributor',
    },
    {
      src: '/yasemin-staff-star.png',
      name: 'yasemin tingleff',
      pronouns: 'she/they',
      title: 'Engagement & Outreach Coordinator',
    },
  ];
  return (
    <section className=''>
      <div className='flex flex-col items-center justify-center lg:flex-row'>
        <div>
          <Image
            src='/bgs-jk.jpeg'
            alt='Kelly (left) and Jayne (right) from Bikini Grad School'
            width={400}
            height={400}
            unoptimized
          />
        </div>
        <div className='flex flex-col space-y-2'>
          <Image
            src='/about-cursive.png'
            alt='About text in cursive'
            width={300}
            height={200}
            unoptimized
          />
          <div className='font-main max-w-sm space-y-6'>
            <p className='text-left text-xl'>
              Bikini Grad School is a magazine and art community.
            </p>
            <p className='text-xl'>
              Bikini Grad School was born out of a want for connection in adult
              life. The mag works to build community through creative
              conversations, in-person events and a monthly zine, someday to be
              a physical publication.
            </p>
            <p className='text-xl'>
              The big gorgeous brains behind BGS are Kelly Slater and Jayne
              Breakfast.
            </p>
          </div>
        </div>
      </div>
      <PhotoHeader
        imgUrl='/staff-photo-header.jpg'
        altText='BGS staff'
        overlayText={['STAFF']}
        aspectRatio={'video'}
        textPosition={'center'}
        textSize={'large'}
      />
      <div className='font-main px-4 pt-4'>
        <div className='grid gap-12 md:grid-cols-2 lg:grid-cols-4'>
          {staff.map((member, i) => (
            <Card
              key={i}
              className='bg-background hover:bg-bgs-pink/40 h-full border-none shadow-none transition-colors duration-300'
            >
              <CardHeader className='flex justify-center'>
                <Image
                  src={member.src}
                  alt={member.name + ',' + member.title}
                  height={400}
                  width={400}
                  unoptimized
                />
              </CardHeader>
              <CardContent>
                <p className='text-center text-3xl'>{member.name}</p>
                <p className='text-center text-lg'>
                  {member.title},{' '}
                  <span className='font-bold'>{member.pronouns}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className='flex flex-col justify-center gap-12 px-4 pt-4 md:flex-row'>
        <div className='flex max-w-xs flex-col gap-4'>
          <h6 className='font-chonk chonk-shadow text-4xl text-white'>
            SUPPORT BGS
          </h6>
          <p className='font-main text-lg'>
            a little love for your favorite mag goes a long way!
          </p>
          <p className='font-main text-lg'>
            with your generosity, we can support women and nb artists in
            bringing you the content you love.
          </p>
        </div>
        <div>
          <Image
            src='/support-us.jpeg'
            alt='Bikini Grad School'
            width={400}
            height={400}
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
