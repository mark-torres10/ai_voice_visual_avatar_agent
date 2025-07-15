import { AudioGenerationResponse } from './types';

export async function generateAudio(
  userMessage: string
): Promise<AudioGenerationResponse> {
  const res = await fetch('/api/generate/audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMessage }),
  });

  if (!res.ok) {
    // Optionally, parse error response for more details
    throw new Error('Failed to generate audio');
  }

  const data = await res.json();
  return data as AudioGenerationResponse;
}
