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

// Video Generation API
export async function generateVideo(
  script: string,
  audioUrl: string,
  photoUrl?: string
): Promise<{ videoUrl: string }> {
  const res = await fetch('/api/generate/video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ script, audioUrl, photoUrl }),
  });
  if (!res.ok) {
    throw new Error('Failed to generate video');
  }
  const data = await res.json();
  if (!data.videoUrl) {
    throw new Error('No videoUrl returned');
  }
  return { videoUrl: data.videoUrl };
}
