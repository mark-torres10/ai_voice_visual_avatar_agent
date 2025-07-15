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
      console.error('[SERVERLESS VIDEO API] Invalid script', { script });
      return NextResponse.json({ error: 'Invalid script' }, { status: 400 });
    }
    if (
      !audioUrl ||
      typeof audioUrl !== 'string' ||
      !audioUrl.startsWith('http')
    ) {
      console.error('[SERVERLESS VIDEO API] Invalid audioUrl', { audioUrl });
      return NextResponse.json({ error: 'Invalid audioUrl' }, { status: 400 });
    }
    // Use default photo if not provided
    const finalPhotoUrl =
      photoUrl && typeof photoUrl === 'string' && photoUrl.length > 0
        ? photoUrl
        : DEFAULT_PHOTO_URL;
    console.log('[SERVERLESS VIDEO API] Using photoUrl:', finalPhotoUrl);

    // Proxy to backend video service
    let backendRes, data;
    try {
      backendRes = await fetch(BACKEND_VIDEO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script, audioUrl, photoUrl: finalPhotoUrl }),
      });
      data = await backendRes.json();
      console.log('[SERVERLESS VIDEO API] Backend response:', {
        status: backendRes.status,
        data,
      });
    } catch (err) {
      console.error(
        '[SERVERLESS VIDEO API] Error calling backend video service:',
        err
      );
      return NextResponse.json(
        {
          error: 'Failed to contact backend video service',
          details: String(err),
        },
        { status: 500 }
      );
    }

    if (!backendRes.ok) {
      console.error('[SERVERLESS VIDEO API] Backend error:', data);
      return NextResponse.json(
        { error: data.error || 'Video generation failed', details: data },
        { status: backendRes.status }
      );
    }

    // Accept both { videoUrl } and { data: { videoUrl } } shapes
    const videoUrl = data.videoUrl || data.data?.videoUrl;
    if (!videoUrl) {
      console.error(
        '[SERVERLESS VIDEO API] No videoUrl returned from backend',
        { data }
      );
      return NextResponse.json(
        { error: 'No videoUrl returned from backend', details: data },
        { status: 500 }
      );
    }
    console.log(
      '[SERVERLESS VIDEO API] Step COMPLETE: Returning videoUrl:',
      videoUrl
    );
    return NextResponse.json({ videoUrl });
  } catch (err) {
    console.error('[SERVERLESS VIDEO API] UNEXPECTED ERROR:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
