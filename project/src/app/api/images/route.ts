import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const internalKey = process.env.HONO_INTERNAL_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_HONO_API_KEY;

  if (!internalKey || !apiUrl) {
    return NextResponse.json(
      { error: 'Service not configured' },
      { status: 500 }
    );
  }
  try {
    const { imagePath } = await req.json();
    if (!imagePath) {
      return NextResponse.json(
        { error: 'imagePath is required' },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-API-Key': internalKey,
      },
      body: JSON.stringify({ imagePath }),
    });
    const responseData = await backendResponse.json();
    if (!responseData.ok) {
      // Log the error details from Hono API if available
      console.error(`Hono API Error (${responseData.status}):`, responseData);
      throw new Error(
        responseData.error ||
          `Failed to process image via Hono API. Status: ${responseData.status}`
      );
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Unknown error in api/images route' },
      { status: 500 }
    );
  }
}
