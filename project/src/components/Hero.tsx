import Image from "next/image"
import localFont from 'next/font/local'

const chonk = localFont({ src: '/../../public/fonts/3602-chonk-web.woff2'})

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-12 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl">
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
          <p className="text-custom-pink-text text-xl">Bikini Grad School is a magazine for women and queer people.</p>
          <p className="text-custom-pink-text">Our January edition: Glam is available now.</p>
        </div>
        {/* Image */}
        <div className="relative aspect-square w-full">
          <Image
            src="/kelly-transparent.png"
            alt="Bikini Grad School"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>
    </section>
  )
}

