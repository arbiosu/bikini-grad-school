import Image from "next/image"
import localFont from 'next/font/local'
import { Playfair_Display } from 'next/font/google'
import landingPageImage from "./../../public/kelly-transparent.png"

const chonk = localFont({ src: '/../../public/fonts/3602-chonk-web.woff2'})
const playfair = Playfair_Display({ subsets: ['latin']})

export function Hero() {
  return (
    <section className="container mx-auto overflow-hidden">
      <div className="md:grid md:grid-cols-2 items-center">
        <div className="space-y-8">
          <h1 className="text-6xl lg:text-8xl px-4 md:py-20 lg:px-40">
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
                    lineHeight: "0.91"
                  }}
              >
                  BIKINI
              </span>
              <span
                  className={`${chonk.className} text-white block lg:mx-14 lg:px-3 mx-11`}
                  style={{
                    textShadow: `
                      -2px -2px 0 #000,
                      2px -2px 0 #000,
                      -2px 2px 0 #000,
                      2px 2px 0 #000,
                      -12px 12px 0 #000
                    `,
                    lineHeight: "0.91"
                  }}>
                GRAD
              </span>
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
                    lineHeight: "0.91"
                  }}>
                SCHOOL
              </span>
          </h1>
          <p className={`${playfair.className} text-custom-pink-text text-xl py-4 px-2 lg:px-40`}>
            A magazine for women and queer people.
          </p>
          <p className="text-custom-pink-text text-lg px-2 lg:px-40">
            Our January Edition: Glam is available now.
          </p>
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

