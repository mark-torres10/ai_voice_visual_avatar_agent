'use client';

import { useState } from 'react';
import SubmissionForm from '@/components/SubmissionForm';
import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmission = async (script: string) => {
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate video';
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error?.message || errorMessage;
        } catch (e) {
          // The response is not valid JSON, so we'll use the default error message.
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setVideoUrl(data.videoUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          AI Avatar Generator
        </h1>
        <SubmissionForm onSubmission={handleSubmission} isLoading={isLoading} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {videoUrl && <VideoPlayer src={videoUrl} />}
      </div>
    </main>
  );
}
