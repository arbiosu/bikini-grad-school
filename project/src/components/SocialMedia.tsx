import Link from 'next/link';
import { JSX } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const socialMediaLinks = [
  {
    href: 'https://www.instagram.com/bikinigradschool/',
    icon: <InstagramIcon />,
  },
  { href: 'https://www.tiktok.com/@bikinigradschool', icon: <TikTokIcon /> },
  { href: 'https://www.youtube.com/@bikinigradschool', icon: <YouTubeIcon /> },
];

interface SocialMediaIconLinkProps {
  href: string;
  icon: JSX.Element;
}

export function SocialMediaIconLink({ href, icon }: SocialMediaIconLinkProps) {
  return (
    <Link
      href={href}
      rel='noopener noreferrer'
      className='block transition-transform hover:scale-110 focus:scale-110 active:scale-95'
      target='_blank'
    >
      {icon}
    </Link>
  );
}

export function SocialMediaIconLinks({
  items,
}: {
  items: SocialMediaIconLinkProps[];
}) {
  return (
    <div className='flex justify-start space-x-8'>
      {items.map((item, index) => (
        <SocialMediaIconLink href={item.href} icon={item.icon} key={index} />
      ))}
    </div>
  );
}

export default function SocialMediaCard() {
  return (
    <Card className='mb-8 border-none p-8 shadow-none'>
      <CardHeader>
        <CardTitle className='text-4xl'>Follow Us</CardTitle>
        <CardDescription className='text-lg'>
          Follow us on social media!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialMediaIconLinks items={socialMediaLinks} />
      </CardContent>
    </Card>
  );
}

export function InstagramIcon() {
  return (
    <svg
      width='64'
      height='64'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
      <g
        id='SVGRepo_tracerCarrier'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></g>
      <g id='SVGRepo_iconCarrier'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z'
          className='fill-current'
        ></path>
        <path
          d='M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z'
          className='fill-current'
        ></path>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z'
          className='fill-current'
        ></path>
      </g>
    </svg>
  );
}

export function TikTokIcon() {
  return (
    <svg
      width='64'
      height='64'
      viewBox='0 0 32 32'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
    >
      <title>TikTok</title>
      <path
        d='M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z'
        className='fill-current'
      ></path>
    </svg>
  );
}

export function YouTubeIcon() {
  return (
    <svg
      width='64'
      height='64'
      viewBox='0 0 32 32'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
    >
      <title>YouTube</title>
      <path
        d='M31.331 8.248c-0.368-1.385-1.451-2.468-2.827-2.833l-0.028-0.006c-2.56-0.689-12.476-0.689-12.476-0.689s-9.928 0-12.476 0.689c-1.403 0.371-2.486 1.454-2.849 2.812l-0.006 0.027c-0.486 2.517-0.764 5.42-0.764 8.384 0 0.279 0.002 0.558 0.007 0.835l-0.001-0.042c-0.004 0.235-0.006 0.514-0.006 0.793 0 2.965 0.278 5.868 0.809 8.682l-0.045-0.298c0.368 1.385 1.451 2.468 2.827 2.833l0.028 0.006c2.548 0.689 12.476 0.689 12.476 0.689s9.928 0 12.476-0.689c1.403-0.371 2.486-1.454 2.849-2.812l0.006-0.027c0.485-2.517 0.764-5.42 0.764-8.384 0-0.279-0.002-0.558-0.007-0.835l0.001 0.042c0.004-0.235 0.006-0.514 0.006-0.793 0-2.965-0.278-5.868-0.809-8.682l0.045 0.298zM12.8 20.8v-8l8.133 4-8.133 4z'
        className='fill-current'
      ></path>
    </svg>
  );
}
