import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

console.log('[SERVERLESS AUDIO API] /api/generate/audio route loaded');

const GPT_CONFIG = {
  model: 'gpt-4o-mini',
  maxTokens: 150,
  temperature: 0.7,
  presencePenalty: 0.1,
  frequencyPenalty: 0.1,
};

const SYSTEM_PROMPT = `You are a friendly, conversational AI avatar. 
Generate natural, engaging responses that sound authentic when spoken aloud.
- Keep responses 1-3 sentences
- Use conversational tone with natural pauses
- Avoid complex technical jargon
- Include subtle emotional expressions
- Length: 20-100 words maximum`;

const ELEVENLABS_VOICE_CONFIG = {
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // Default: Bella
  modelId: 'eleven_multilingual_v2',
  voiceSettings: {
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.2,
    use_speaker_boost: true,
  },
};

export async function POST(req: NextRequest) {
  console.log('[SERVERLESS AUDIO API] POST /api/generate/audio invoked');
  try {
    const { userMessage } = await req.json();
    console.log(`[SERVERLESS AUDIO API] Received userMessage: ${userMessage}`);
    if (
      !userMessage ||
      typeof userMessage !== 'string' ||
      userMessage.length < 1 ||
      userMessage.length > 500
    ) {
      console.error('[SERVERLESS AUDIO API] Invalid userMessage');
      return NextResponse.json(
        { error: 'Invalid userMessage' },
        { status: 400 }
      );
    }
    if (!process.env.OPENAI_API_KEY) {
      console.error('[SERVERLESS AUDIO API] Missing OPENAI_API_KEY');
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY' },
        { status: 500 }
      );
    }
    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('[SERVERLESS AUDIO API] Missing ELEVENLABS_API_KEY');
      return NextResponse.json(
        { error: 'Missing ELEVENLABS_API_KEY' },
        { status: 500 }
      );
    }

    // Step 1: Generate script with GPT-4o
    let script;
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: GPT_CONFIG.model,
        max_tokens: GPT_CONFIG.maxTokens,
        temperature: GPT_CONFIG.temperature,
        presence_penalty: GPT_CONFIG.presencePenalty,
        frequency_penalty: GPT_CONFIG.frequencyPenalty,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      });
      const messageContent = response.choices?.[0]?.message?.content;
      if (!messageContent) throw new Error('No script returned from GPT-4o');
      script = messageContent.trim();
      const wordCount = script.split(/\s+/).length;
      if (wordCount < 5) throw new Error('Generated script too short');
      if (wordCount > 100) script = script.split(/\s+/).slice(0, 100).join(' ');
      console.log(
        `[SERVERLESS AUDIO API] Step 1 COMPLETE: Script generated: "${script}"`
      );
    } catch (err: unknown) {
      console.error(
        '[SERVERLESS AUDIO API] Step 1 ERROR: GPT-4o script generation failed:',
        err instanceof Error ? err.message : String(err),
        err instanceof Error ? err.stack : undefined
      );
      return NextResponse.json(
        {
          error: 'Script generation failed',
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 }
      );
    }

    // Step 2: Generate audio with ElevenLabs
    let audioBase64;
    try {
      const elevenlabsRes = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_CONFIG.voiceId}`,
        {
          method: 'POST',
          headers: {
            Accept: 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: script,
            model_id: ELEVENLABS_VOICE_CONFIG.modelId,
            voice_settings: ELEVENLABS_VOICE_CONFIG.voiceSettings,
          }),
        }
      );
      if (!elevenlabsRes.ok) {
        const errText = await elevenlabsRes.text();
        console.error(
          '[SERVERLESS AUDIO API] Step 2 ERROR: ElevenLabs API failed:',
          errText
        );
        return NextResponse.json(
          { error: 'Audio generation failed', details: errText },
          { status: 500 }
        );
      }
      const audioBuffer = Buffer.from(await elevenlabsRes.arrayBuffer());
      audioBase64 = audioBuffer.toString('base64');
      console.log(
        `[SERVERLESS AUDIO API] Step 2 COMPLETE: Audio generated, size: ${audioBuffer.length} bytes`
      );
    } catch (err: unknown) {
      console.error(
        '[SERVERLESS AUDIO API] Step 2 ERROR: ElevenLabs audio generation failed:',
        err instanceof Error ? err.message : String(err),
        err instanceof Error ? err.stack : undefined
      );
      return NextResponse.json(
        {
          error: 'Audio generation failed',
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 }
      );
    }

    // Step 3: Respond with script and audioBase64
    console.log('[SERVERLESS AUDIO API] Step 3: Sending response to client.');
    return NextResponse.json({
      script,
      audioBase64,
    });
  } catch (err: unknown) {
    console.error(
      '[SERVERLESS AUDIO API] UNEXPECTED ERROR:',
      err instanceof Error ? err.message : String(err),
      err instanceof Error ? err.stack : undefined
    );
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
