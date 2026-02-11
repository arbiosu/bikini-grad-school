import Link from 'next/link';
import { Button } from './ui/button';

interface BackButtonProps {
  href: string;
  label: string;
}
export default function BackButton(props: BackButtonProps) {
  return (
    <Button variant={'outline'} asChild>
      <Link href={props.href}>{props.label}</Link>
    </Button>
  );
}
