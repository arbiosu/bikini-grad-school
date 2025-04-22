import { resend } from '@/lib/resend/resend';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SubscriptionEmail } from '@/components/email/Subsciption';

// TODO: Fix

// Rate limit configuration
const RATE_LIMIT = 3; // Number of allowed submissions
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // Time window in milliseconds (1 hour)
const COOKIE_NAME = 'contact_submissions';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const submissionsCookie = (await cookieStore).get(COOKIE_NAME);

    let submissions: { timestamp: number; count: number } = {
      timestamp: Date.now(),
      count: 0,
    };
    if (submissionsCookie?.value) {
      try {
        submissions = JSON.parse(submissionsCookie.value);
        if (Date.now() - submissions.timestamp > RATE_LIMIT_WINDOW) {
          submissions = { timestamp: Date.now(), count: 0 };
        }
      } catch (e) {
        console.error(e);
        submissions = { timestamp: Date.now(), count: 0 };
      }
    }
    if (submissions.count >= RATE_LIMIT) {
      const resetTime = submissions.timestamp + RATE_LIMIT_WINDOW;
      const timeRemaining = Math.ceil((resetTime - Date.now()) / 60000); // in minutes

      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          resetInMinutes: timeRemaining,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email: string = body.email;
    const { data, error } = await resend.emails.send({
      from: 'Bikini Grad School <noreply@marketing.bikinigradschool.com>',
      to: email,
      subject: 'Welcome to Bikini Grad School!',
      react: SubscriptionEmail({ email: email }) as React.ReactElement,
    });

    if (error) {
      console.log(error);
      return NextResponse.json({ error }, { status: 500 });
    }

    submissions.count += 1;
    const response = NextResponse.json(
      {
        data,
        remaining: RATE_LIMIT - submissions.count,
      },
      { status: 200 }
    );
    response.cookies.set({
      name: COOKIE_NAME,
      value: JSON.stringify(submissions),
      expires: new Date(Date.now() + RATE_LIMIT_WINDOW),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const contact = await resend.contacts.create({
      email: email,
      unsubscribed: false,
      audienceId: 'b2e08182-9816-4656-8c1a-3265a1634c51',
    });

    if (contact.error) {
      console.log(contact.error);
      return NextResponse.json({ error: contact.error }, { status: 500 });
    }

    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
