import { resend } from '@/lib/resend/resend';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { SubscriptionEmail } from '@/components/email/Subsciption';

const FROM_EMAIL = process.env.CONTACT_FORM_FROM_EMAIL;

// Rate limit configuration
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const COOKIE_NAME = 'contact_submissions';

const SubscribeFormSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address.' }),
});

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

type SubscribeMessage = z.infer<typeof SubscribeFormSchema>;

export async function POST(req: Request) {
  // -- Check environment --
  if (!FROM_EMAIL || !process.env.RESEND_SECRET_KEY) {
    console.error('Missing environment variables for contact form');
    return NextResponse.json(
      { error: 'Internal server configuration error.' },
      { status: 500 }
    );
  }
  // -- Rate Limits --
  const cookieStore = cookies();
  const submissionsCookie = (await cookieStore).get(COOKIE_NAME);
  let submissions: { timestamp: number; count: number };
  try {
    const now = Date.now();
    if (submissionsCookie?.value) {
      submissions = JSON.parse(submissionsCookie.value);
      // reset
      if (now - submissions.timestamp > RATE_LIMIT_WINDOW_MS) {
        submissions = { timestamp: Date.now(), count: 0 };
      }
    } else {
      submissions = { timestamp: now, count: 0 };
    }
    if (submissions.count >= RATE_LIMIT) {
      const resetTime = submissions.timestamp + RATE_LIMIT_WINDOW_MS;
      const timeRemaining = Math.ceil((resetTime - now) / 60000);
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          resetInMinutes: timeRemaining,
        },
        { status: 429 }
      );
    }
  } catch (e) {
    console.error('Error processing rate limit cookie: ', e);
    return NextResponse.json(
      { error: 'Could not process request due to internal error' },
      { status: 500 }
    );
  }
  // -- Parse Response --
  let body: SubscribeMessage;
  try {
    const rawBody = await req.json();
    body = SubscribeFormSchema.parse(rawBody);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('Error parsing request body:', error);
    return NextResponse.json(
      { error: 'Invalid request format.' },
      { status: 400 }
    );
  }

  // -- Send Email --
  try {
    const safeEmail = escapeHtml(body.email);
    const { error } = await resend.emails.send({
      from: `Bikini Grad School <${FROM_EMAIL}>`,
      to: safeEmail,
      subject: 'Welcome to Bikini Grad School',
      react: SubscriptionEmail({ email: safeEmail }) as React.ReactElement,
    });
    if (error) {
      console.error('Resend API error: ', error);
      return NextResponse.json(
        { error: 'Failed to send email.' },
        { status: 500 }
      );
    }
    // -- Success --
    submissions.count += 1;
    const response = NextResponse.json(
      {
        message: 'Successfully subscribed!',
        remaining: RATE_LIMIT - submissions.count,
      },
      { status: 200 }
    );
    response.cookies.set({
      name: COOKIE_NAME,
      value: JSON.stringify(submissions),
      expires: new Date(Date.now() + RATE_LIMIT_WINDOW_MS),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    const contact = await resend.contacts.create({
      email: safeEmail,
      unsubscribed: false,
      audienceId: 'b2e08182-9816-4656-8c1a-3265a1634c51',
    });

    if (contact.error) {
      console.log(contact.error);
      return NextResponse.json({ error: contact.error }, { status: 500 });
    }
    return response;
  } catch (err) {
    console.error('Unexpected error in subscribe form API: ', err);
    return NextResponse.json(
      { error: 'An unexpected internal server error occurred' },
      { status: 500 }
    );
  }
}
