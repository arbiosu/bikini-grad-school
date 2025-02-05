import { Star } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative px-4 py-12 md:py-24">
      {/* Decorative Stars TODO FIX*/}
      <div className="relative top-12 right-12">
        <Star className="w-8 h-8 text-red-500 fill-red-500" />
      </div>
      <div className="relative bottom-12 left-24">
        <Star className="w-8 h-8 text-red-500 fill-red-500" />
      </div>
        {/* */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black 
          text-transparent bg-clip-text bg-gradient-to-r from-pink-500
        to-purple-500 drop-shadow-lg">
            <span className="block relative">
                <span
                    className="absolute inset-0 text-white"
                    style={{
                      textShadow: `
                        -2px -2px 0 #000,
                        2px -2px 0 #000,
                        -2px 2px 0 #000,
                        2px 2px 0 #000,
                        4px 4px 0px #000
                      `,
                    }}
                >
                    BIKINI GRAD SCHOOL
                </span>
                    BIKINI GRAD SCHOOL
            </span>
          </h1>
          <p className="text-pink-600 text-xl">Bikini Grad School is a magazine for women and queer people.</p>
          <p className="text-pink-500">Our January edition: Glam is available now.</p>
        </div>
        {/* Image */}
        <div className="absolute -top-20 -right-1/4 w-[80%] h-screen ml-auto">
          <Image
            src="/kelly-transparent.png"
            alt="Bikini Grad School"
            fill
            className="object-contain object-right-bottom md:object-right-top"
            priority
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
      </div>
    </section>
  )
}

