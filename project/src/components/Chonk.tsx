import { chonk } from '../../public/fonts/fonts';

export function ChonkText(props: { first: string; second: string }) {
  const { first, second } = props;
  return (
    <section className='mb-10 py-10'>
      <h1 className={`${chonk.className} text-center text-5xl md:text-8xl`}>
        <span className='block leading-chonk text-white text-shadow-chonk'>
          {first}
        </span>
        <span className='block leading-chonk text-white text-shadow-chonk'>
          {second}
        </span>
      </h1>
    </section>
  );
}
