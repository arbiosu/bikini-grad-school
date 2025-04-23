import Image from 'next/image';

export default function BGSstar() {
  return (
    <Image
      src='/bgs-star.svg'
      alt='Bikini Grad School'
      width={64}
      height={64}
      unoptimized
    />
  );
}
