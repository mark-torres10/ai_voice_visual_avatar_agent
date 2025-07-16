import { NextRequest, NextResponse } from 'next/server';

const DID_API_URL = 'https://api.d-id.com/talks';
const D_ID_API_KEY = process.env.D_ID_API_KEY;
const DEFAULT_PHOTO_URL = '/generic_secretary_stock_image.jpg';

async function createTalkRequest({
  audioUrl,
  script,
  presenterUrl,
}: {
  audioUrl: string;
  script: string;
  presenterUrl: string;
}) {
  const requestData = {
    source_url: presenterUrl,
    script: {
      type: 'audio',
      audio_url: audioUrl,
      reduce_noise: true,
      ssml: false,
    },
    config: {
      result_format: 'mp4',
      fluent: true,
      pad_audio: 0.0,
      stitch: true,
      align_driver: true,
      align_expand_factor: 1.0,
    },
  };
  console.log('[SERVERLESS VIDEO API] audioUrl:', audioUrl);
  console.log('[SERVERLESS VIDEO API] script:', script);
  console.log('[SERVERLESS VIDEO API] presenterUrl:', presenterUrl);

  const encodedKey = Buffer.from(D_ID_API_KEY || '').toString('base64');
  const res = await fetch(DID_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`D-ID createTalkRequest failed: ${err}`);
  }
  return res.json();
}

async function pollVideoStatus(talkId: string) {
  const maxAttempts = 60;
  let attempts = 0;
  const encodedKey = Buffer.from(D_ID_API_KEY || '').toString('base64');
  while (attempts < maxAttempts) {
    const res = await fetch(`https://api.d-id.com/talks/${talkId}`, {
      headers: {
        Authorization: `Basic ${encodedKey}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`D-ID pollVideoStatus failed: ${err}`);
    }
    const data = await res.json();
    if (data.status === 'done') {
      return data;
    } else if (data.status === 'error' || data.status === 'rejected') {
      throw new Error(
        `D-ID video generation failed: ${data.error?.description || 'Unknown error'}`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
    attempts++;
  }
  throw new Error('D-ID video generation timeout');
}

export async function POST(req: NextRequest) {
  console.log('[SERVERLESS VIDEO API] POST /api/generate/video invoked');
  try {
    const { script, audioUrl, photoUrl } = await req.json();
    console.log('[SERVERLESS VIDEO API] Received:', {
      script,
      audioUrl,
      photoUrl,
    });
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
    if (!D_ID_API_KEY) {
      console.error('[SERVERLESS VIDEO API] Missing D_ID_API_KEY');
      return NextResponse.json(
        { error: 'Missing D_ID_API_KEY' },
        { status: 500 }
      );
    }
    // Resolve presenter image URL
    let presenterUrl =
      photoUrl && typeof photoUrl === 'string' && photoUrl.length > 0
        ? photoUrl
        : DEFAULT_PHOTO_URL;
    if (presenterUrl.startsWith('/')) {
      // Convert to absolute URL for Vercel
      const host =
        req.headers.get('x-forwarded-host') ||
        req.headers.get('host') ||
        'localhost:3000';
      const protocol =
        req.headers.get('x-forwarded-proto') ||
        (host.includes('localhost') ? 'http' : 'https');
      presenterUrl = `${protocol}://${host}${presenterUrl}`;
    }
    console.log('[SERVERLESS VIDEO API] Using presenterUrl:', presenterUrl);
    // Step 1: Create talk request
    let talk;
    try {
      talk = await createTalkRequest({ audioUrl, script, presenterUrl });
      console.log('[SERVERLESS VIDEO API] D-ID talk created:', talk);
    } catch (err) {
      console.error('[SERVERLESS VIDEO API] Error creating D-ID talk:', err);
      return NextResponse.json(
        { error: 'Failed to create D-ID talk', details: String(err) },
        { status: 500 }
      );
    }
    // Step 2: Poll for video completion
    let videoData;
    try {
      videoData = await pollVideoStatus(talk.id);
      console.log('[SERVERLESS VIDEO API] D-ID video done:', videoData);
    } catch (err) {
      console.error(
        '[SERVERLESS VIDEO API] Error polling D-ID video status:',
        err
      );
      return NextResponse.json(
        { error: 'Failed to generate video', details: String(err) },
        { status: 500 }
      );
    }
    if (!videoData.result_url) {
      console.error('[SERVERLESS VIDEO API] No videoUrl returned from D-ID', {
        videoData,
      });
      return NextResponse.json(
        { error: 'No videoUrl returned from D-ID', details: videoData },
        { status: 500 }
      );
    }
    console.log(
      '[SERVERLESS VIDEO API] Step COMPLETE: Returning videoUrl:',
      videoData.result_url
    );
    return NextResponse.json({ videoUrl: videoData.result_url });
  } catch (err) {
    console.error('[SERVERLESS VIDEO API] UNEXPECTED ERROR:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
