import LandingPage from '@/components/LandingPage';
import { ImageGridTextOverlay } from '@/components/ImageGrid';
import { ChonkText } from '@/components/Chonk';
import SubscribeCard from '@/components/Subscribe';

const imgs = [
  { imgUrl: "/bgs-4.png", text: "EDITORIALS"},
  { imgUrl: "/bgs-3.png", text: "ARTICLES"},
  { imgUrl: "/bgs-2.png", text: "DIGI MEDIA"},
  { imgUrl: "/bgs-1.png", text: "MERCH"}
];

export default function Home() {
  return (
    <>
      <LandingPage />
      <div className="py-8"></div>
      <ChonkText first={"SHOW"} second={"ME"} />
      <ImageGridTextOverlay images={imgs} />
      <div className="py-8"></div>
      <ChonkText first={"GET"} second={"UPDATES"} />
      <div className="flex flex-col items-center">
        <SubscribeCard />
      </div>
    </>
  );
}
