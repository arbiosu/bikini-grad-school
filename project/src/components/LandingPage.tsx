import { chonk } from "../../public/fonts/fonts";

function LandinPageVideo() {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video 
                autoPlay 
                loop
                muted 
                playsInline 
                preload="auto"
                className="w-full h-full object-cover"
            >
                <source 
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/images/videos/bgs-compressed.mp4`} 
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export function ComingSoon() {
    return (
        <section className="py-10">
            <h1 className="text-5xl lg:text-8xl px-4 text-center">
                <span className={`${chonk.className} text-white block text-shadow-chonk leading-chonk`}>
                    COMING
                </span>
                <span className={`${chonk.className} text-white block text-shadow-chonk leading-chonk`}>
                    SOON
                </span>
            </h1>
        </section>
    );
};

export default function LandingPage() {
    return (
        <div className="h-screen w-full relative">
            <LandinPageVideo />
            <div className="absolute inset-0 flex flex-col items-center justify-center mx-8">
                <h1 className="text-5xl lg:text-8xl px-4 md:py-20 lg:px-40">
                    <div className="mx-auto">
                        <span className={`${chonk.className} text-white block text-shadow-chonk leading-chonk mx-4`}>
                            BIKINI
                        </span>
                        <span className={`${chonk.className} text-white block text-shadow-chonk leading-chonk mx-12 lg:mx-16`}>
                            GRAD
                        </span>
                        <span className={`${chonk.className} text-white block text-shadow-chonk leading-chonk mb-6 mx-2`}>
                            SCHOOl
                        </span>
                    </div>

                </h1>
                <h2 className="text-xl shadow-sm font-medium">
                    a magazine for women and queer people
                </h2>
            </div>
        </div>
    );
};