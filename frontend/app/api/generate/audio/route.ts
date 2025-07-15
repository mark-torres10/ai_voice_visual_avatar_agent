import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userMessage } = await req.json();
    if (
      !userMessage ||
      typeof userMessage !== 'string' ||
      userMessage.length < 1 ||
      userMessage.length > 500
    ) {
      return NextResponse.json(
        { error: 'Invalid userMessage' },
        { status: 400 }
      );
    }

    // Proxy to backend audio service (assume running at http://localhost:3001/api/generate/audio)
    const backendRes = await fetch('http://localhost:3001/api/generate/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage }),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
