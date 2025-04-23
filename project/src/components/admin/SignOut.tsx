import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  return (
    <form action='/admin/signout' method='post'>
      <Button>
        <LogOut />
        {'Log Out'}
      </Button>
    </form>
  );
}
