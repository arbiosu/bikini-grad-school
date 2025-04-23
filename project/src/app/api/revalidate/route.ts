import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');

  if (path) {
    revalidatePath(path, 'layout');
    return NextResponse.json(
      { revalidated: true, now: Date.now() },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      revalidated: false,
      now: Date.now(),
      message: 'Missing path to revalidate',
    },
    { status: 400 }
  );
}
