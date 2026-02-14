'use client';

import { signOutAction } from '@/actions/auth';
import { Button } from '../ui/button';

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <Button
        type='submit'
        className={
          className ?? 'px-4 py-2 text-sm text-black transition-colors'
        }
      >
        Sign out
      </Button>
    </form>
  );
}
