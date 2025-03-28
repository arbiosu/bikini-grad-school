import { resend } from '@/lib/resend/resend';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface ContactMessage {
  name: string;
  email: string;
  source: string;
  topic: string;
  message: string;
}

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

    const body: ContactMessage = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Bikini Grad School <noreply@marketing.bikinigradschool.com>',
      to: 'amea@oregonstate.edu',
      subject: `Message from Contact Form: ${body.topic}`,
      html: `<p>
                    From: ${body.name} ${body.email}
                    </p>
                    <br></br>
                    <p>Source: ${body.source}</p>
                    <br></br>
                    <p>Topic: ${body.topic}</p>
                    <br></br>
                    <p>Message: ${body.message}</p>
                    `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Update submission count
    submissions.count += 1;

    // Create the response
    const response = NextResponse.json(
      {
        data,
        remaining: RATE_LIMIT - submissions.count,
      },
      { status: 200 }
    );

    // Set the updated cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: JSON.stringify(submissions),
      expires: new Date(Date.now() + RATE_LIMIT_WINDOW),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
