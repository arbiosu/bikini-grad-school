import Image from 'next/image';

export default function BGSLogo() {
  return (
    <Image
      src='/bgs.svg'
      alt='Bikini Grad School'
      width={64}
      height={64}
      unoptimized
    />
  );
}
