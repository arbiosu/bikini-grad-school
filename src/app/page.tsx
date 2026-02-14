import Banner from '@/components/top-banner';
import VideoHero from '@/components/video-hero';
import { FAQHorizontalScroll } from '@/components/faqs';
import ZineClubIntro from '@/components/zine-club-intro';

const faqs = [
  {
    id: 1,
    question: 'Can I switch my zine series or change my tier?',
    answer:
      'Absolutely. To change your tier or switch your zine series, head to your login portal. Your changes will be reflected in the next subscription cycle.',
  },
  {
    id: 2,
    question: 'Is there tracking for my zine order?',
    answer:
      'Zine orders are shipped with stamps and therefore do not include tracking information or shipping confirmation emails beyond your initial order confirmation.',
  },
  {
    id: 3,
    question: 'How do referrals work?',
    answer:
      'If you refer a friend, you and your friend both receive one free month of zine club. Click here for referrals.',
  },
  {
    id: 4,
    question: 'What happens if my zine comes damaged or is missing',
    answer:
      'Reach out to bikinigradschool@gmail.com with an image if damaged and a brief description of the problem and we will rectify it.',
  },
  {
    id: 5,
    question: 'When will I get my first zine?',
    answer:
      'If you sign up before the 15th of the month, you will get next month’s zine. If you sign up after the 15th, you get the following month’s zine. For example, if you sign up November 14th, you get your first zine in December. If you sign up November 16th, you get your first zine in January. If you sign up November 15th, you get your first zine in December. ',
  },
  {
    id: 6,
    question: 'When will my zine order arrive?',
    answer:
      'All zines orders ship out on the first of each month and usually arrive within 2-12 calendar days depending on where you live. Check our website for any updates or possible delays.',
  },
  {
    id: 7,
    question: 'Do you ship internationally?',
    answer: 'No :(',
  },
  {
    id: 8,
    question: 'How can I cancel my subscription?',
    answer:
      'Cancel, Re-activate, or Update your subscription anytime in your login portal.',
  },
];

export default function Home() {
  return (
    <>
      <Banner />
      <VideoHero />
      <ZineClubIntro />

      <div className='p-4'>
        <p className='font-main text-center'>BGS Zine Club</p>
        <h6 className='font-chonk chonk-shadow text-center text-5xl text-white md:text-7xl'>
          <span className='font-chonk chonk-shadow mb-4 block text-center'>
            FAQ
          </span>
        </h6>
      </div>
      <FAQHorizontalScroll faqs={faqs} />
    </>
  );
}
