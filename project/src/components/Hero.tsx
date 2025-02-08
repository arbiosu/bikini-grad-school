import Image from "next/image"
import localFont from 'next/font/local'
import landingPageImage from "./../../public/kelly-transparent.png"

const chonk = localFont({ src: '/../../public/fonts/3602-chonk-web.woff2'})

export function Hero() {
  return (
    <section className="container mx-auto px-4 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="space-y-8">
          <h1 className="text-6xl lg:text-8xl">
              <span
                  className={`${chonk.className} text-white block`}
                  style={{
                    textShadow: `
                      -2px -2px 0 #000,
                      2px -2px 0 #000,
                      -2px 2px 0 #000,
                      2px 2px 0 #000,
                      -12px 12px 0 #000
                    `,
                    lineHeight: "1.0"
                  }}
              >
                  BIKINI <br></br>GRAD<br></br>SCHOOl
              </span>
          </h1>
          <p className="text-custom-pink-text text-2xl">A magazine for women and queer people.</p>
          <p className="text-custom-pink-text text-xl">Our January Edition: Glam is available now.</p>
        </div>
        {/* Image */}
        <div className="relative aspect-square w-full">
          <Image
            src={landingPageImage}
            alt="Bikini Grad School"
            fill
            className="object-cover rounded-lg"
            priority
            placeholder="blur"
          />
        </div>
      </div>
    </section>
  )
}

