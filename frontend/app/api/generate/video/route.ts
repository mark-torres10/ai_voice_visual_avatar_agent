import { NextRequest, NextResponse } from 'next/server';

console.log('[SERVERLESS VIDEO API] /api/generate/video route loaded');

const BACKEND_VIDEO_API_URL =
  process.env.BACKEND_VIDEO_API_URL ||
  'http://localhost:3001/api/generate/video';
const DEFAULT_PHOTO_URL = '/generic_secretary_stock_image.jpg';

export async function POST(req: NextRequest) {
  console.log('[SERVERLESS VIDEO API] POST /api/generate/video invoked');
  try {
    const { script, audioUrl, photoUrl } = await req.json();
    console.log('[SERVERLESS VIDEO API] Received:', {
      script,
      audioUrl,
      photoUrl,
    });

    // Basic validation
    if (
      !script ||
      typeof script !== 'string' ||
      script.length < 1 ||
      script.length > 1000
    ) {
      return NextResponse.json({ error: 'Invalid script' }, { status: 400 });
    }
    if (
      !audioUrl ||
      typeof audioUrl !== 'string' ||
      !audioUrl.startsWith('http')
    ) {
      return NextResponse.json({ error: 'Invalid audioUrl' }, { status: 400 });
    }
    // Use default photo if not provided
    const finalPhotoUrl =
      photoUrl && typeof photoUrl === 'string' && photoUrl.length > 0
        ? photoUrl
        : DEFAULT_PHOTO_URL;

    // Proxy to backend video service
    const backendRes = await fetch(BACKEND_VIDEO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script, audioUrl, photoUrl: finalPhotoUrl }),
    });

    const data = await backendRes.json();
    if (!backendRes.ok) {
      console.error('[SERVERLESS VIDEO API] Backend error:', data);
      return NextResponse.json(
        { error: data.error || 'Video generation failed' },
        { status: backendRes.status }
      );
    }

    // Accept both { videoUrl } and { data: { videoUrl } } shapes
    const videoUrl = data.videoUrl || data.data?.videoUrl;
    if (!videoUrl) {
      return NextResponse.json(
        { error: 'No videoUrl returned from backend' },
        { status: 500 }
      );
    }
    return NextResponse.json({ videoUrl });
  } catch (err) {
    console.error('[SERVERLESS VIDEO API] UNEXPECTED ERROR:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
