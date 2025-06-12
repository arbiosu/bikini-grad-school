'use client';

import { CardFooter } from '@/components/ui/card';

import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DonationBox() {
  const [amount, setAmount] = useState('10');
  const [customAmount, setCustomAmount] = useState('');

  //const finalAmount = amount === 'custom' ? customAmount : amount;
  //const donateUrl = `/donate?amount=${finalAmount}`;

  return (
    <Card className='w-full max-w-md rounded-3xl'>
      <CardHeader></CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          {['5', '10', '20', 'custom'].map((value) => (
            <Button
              key={value}
              variant={amount === value ? 'default' : 'outline'}
              onClick={() => setAmount(value)}
              className='h-12'
            >
              {value === 'custom' ? 'Custom' : `$${value}`}
            </Button>
          ))}
        </div>

        {amount === 'custom' && (
          <div className='space-y-2'>
            <Label htmlFor='custom-amount'>Custom Amount ($)</Label>
            <Input
              id='custom-amount'
              type='number'
              min='1'
              placeholder='Enter amount'
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className='w-full'>
          <Link href={'https://venmo.com/u/bikinigradschool'}>
            Donate{' '}
            {amount !== 'custom'
              ? `$${amount}`
              : customAmount
                ? `$${customAmount}`
                : ''}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
