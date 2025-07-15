console.log('[FRONTEND API] /api/generate/audio route loaded');

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('[FRONTEND API] POST /api/generate/audio invoked');
  try {
    const { userMessage } = await req.json();
    console.log(`[FRONTEND API] Received userMessage: ${userMessage}`);
    if (
      !userMessage ||
      typeof userMessage !== 'string' ||
      userMessage.length < 1 ||
      userMessage.length > 500
    ) {
      console.error('[FRONTEND API] Invalid userMessage');
      return NextResponse.json(
        { error: 'Invalid userMessage' },
        { status: 400 }
      );
    }

    // Proxy to backend audio service (assume running at http://localhost:3001/api/generate/audio)
    console.log('[FRONTEND API] Proxying request to backend audio service...');
    const backendRes = await fetch('http://localhost:3001/api/generate/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage }),
    });
    console.log(
      `[FRONTEND API] Received response from backend with status: ${backendRes.status}`
    );
    const data = await backendRes.json();
    console.log('[FRONTEND API] Response data:', data);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('[FRONTEND API] Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
