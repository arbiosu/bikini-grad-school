import { createEmailService } from '@/lib/container';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const FROM_EMAIL = process.env.CONTACT_FORM_FROM_EMAIL;

// Rate limit configuration
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const COOKIE_NAME = 'contact_submissions';

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
  const service = createEmailService();
  // -- Parse Response --
  const body = await req.json();
  const email: string = body.email;

  try {
    const safeEmail = escapeHtml(body.email);
    if (service.verifyEmail(safeEmail)) {
      return NextResponse.json({ error: 'Invalid Email' }, { status: 400 });
    }
    const result = await service.sendNewsletterWelcomeEmail(email);
    if (!result.success) {
      console.error('Resend API error: ', result.error);
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

    const contactResult = await service.addToAudience(safeEmail);
    if (!contactResult.success) {
      console.error('Resend API error: ', contactResult.error);
      return NextResponse.json(
        { error: 'Failed to send email.' },
        { status: 500 }
      );
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
