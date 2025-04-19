import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { type LucideIcon } from 'lucide-react';

interface LinkButtonProps {
  href: string;
  label: string;
  Icon: LucideIcon;
}

export default function LinkButton({ href, label, Icon }: LinkButtonProps) {
  return (
    <Link href={href}>
      <Button>
        <Icon />
        {label}
      </Button>
    </Link>
  );
}
