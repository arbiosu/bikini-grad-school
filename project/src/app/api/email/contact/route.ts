import { resend } from '@/lib/resend/resend';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

const EMAIL_SUBJECT_PREFIX = 'Message from Contact Form:';
const FROM_EMAIL = process.env.CONTACT_FORM_FROM_EMAIL;
const TO_EMAIL = process.env.CONTACT_FORM_TO_EMAIL;

const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const COOKIE_NAME = 'contact_submissions';

const ContactFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required.' }).max(100),
  email: z.string().trim().email({ message: 'Invalid email address.' }),
  source: z.string().min(1, { message: 'Source selection is required.' }),
  topic: z.string().trim().min(1, { message: 'Topic is required.' }).max(150),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters long.' })
    .max(5000),
});

type ContactMessage = z.infer<typeof ContactFormSchema>;

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
  if (!TO_EMAIL || !FROM_EMAIL || !process.env.RESEND_SECRET_KEY) {
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
        submissions = { timestamp: now, count: 0 };
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
      { error: 'Could not process request due to internal error.' },
      { status: 500 }
    );
  }
  // -- Parse Response --
  let body: ContactMessage;
  try {
    const rawBody = await req.json();
    body = ContactFormSchema.parse(rawBody);
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
    const safeName = escapeHtml(body.name);
    const safeEmail = escapeHtml(body.email);
    const safeSource = escapeHtml(body.source);
    const safeTopic = escapeHtml(body.topic);
    const safeMessage = escapeHtml(body.message).replace(/\n/g, '<br>');

    const { error } = await resend.emails.send({
      from: `Bikini Grad School <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: body.email,
      subject: `${EMAIL_SUBJECT_PREFIX} ${safeTopic}`,
      html: `
        <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
        <p><strong>Source:</strong> ${safeSource}</p>
        <p><strong>Topic:</strong> ${safeTopic}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
        `,
    });
    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { error: 'Failed to send email.' },
        { status: 500 }
      );
    }
    // -- Success ---
    submissions.count += 1;
    const remaining = RATE_LIMIT - submissions.count;
    const response = NextResponse.json(
      {
        message: 'Email sent successfully.',
        remainingRequests: remaining,
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
    return response;
  } catch (error) {
    console.error('Unexpected error in contact form API:', error);
    return NextResponse.json(
      { error: 'An unexpected internal server error occurred.' },
      { status: 500 }
    );
  }
}
