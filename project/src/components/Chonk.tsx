import { chonk } from '../../public/fonts/fonts';

interface ChonkProps {
  strings: string[];
}

export function ChonkText({ strings }: ChonkProps) {
  return (
    <section className='mb-10 py-10'>
      <h1 className={`${chonk.className} text-center text-5xl md:text-8xl`}>
        {strings.map((string, index) => (
          <span
            key={index}
            className='block leading-chonk text-white text-shadow-chonk'
          >
            {string}
          </span>
        ))}
      </h1>
    </section>
  );
}
