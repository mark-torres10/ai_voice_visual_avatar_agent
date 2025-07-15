import { POST } from '../app/api/generate/audio/route';
import { NextRequest } from 'next/server';

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockImplementation(({ messages }) => {
            if (messages[1].content === 'fail-gpt') {
              throw new Error('GPT-4o error');
            }
            return {
              choices: [
                { message: { content: 'This is a test script.' } },
              ],
            };
          }),
        },
      },
    })),
  };
});

global.fetch = jest.fn().mockImplementation((url, options) => {
  if (options && options.body && options.body.includes('fail-tts')) {
    return Promise.resolve({
      ok: false,
      text: () => Promise.resolve('TTS error'),
    });
  }
  // Simulate success: return a fake audio buffer
  return Promise.resolve({
    ok: true,
    arrayBuffer: () => Promise.resolve(Buffer.from('audio', 'utf-8')),
  });
});

describe('/api/generate/audio (serverless)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns script and audioBase64 on success', async () => {
    const req = {
      json: async () => ({ userMessage: 'test message' }),
    } as unknown as NextRequest;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.script).toBe('This is a test script.');
    expect(data.audioBase64).toBe(Buffer.from('audio', 'utf-8').toString('base64'));
  });

  it('returns 500 if GPT-4o fails', async () => {
    const req = {
      json: async () => ({ userMessage: 'fail-gpt' }),
    } as unknown as NextRequest;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toMatch(/Script generation failed/);
  });

  it('returns 500 if ElevenLabs fails', async () => {
    const req = {
      json: async () => ({ userMessage: 'fail-tts' }),
    } as unknown as NextRequest;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toMatch(/Audio generation failed/);
  });
}); 