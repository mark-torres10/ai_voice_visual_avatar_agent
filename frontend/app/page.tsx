'use client';

import { useState } from 'react';
import SubmissionForm from '@/components/SubmissionForm';
import VideoPlayer from '@/components/VideoPlayer';
import PersonaCarousel from '@/components/PersonaCarousel';
import { Persona } from '@/lib/personas';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

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
        body: JSON.stringify({
          script,
          personaId: selectedPersona?.id,
        }),
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

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  return (
    <main className="min-h-screen bg-ponte-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-ponte-text mb-4">
              AI Avatar Generator
            </h1>
            <p className="text-lg text-ponte-textMuted">
              Choose your AI avatar and create personalized videos with
              realistic speech and animation
            </p>
          </div>

          {/* Persona Carousel */}
          <div className="mb-8">
            <PersonaCarousel
              onPersonaSelect={handlePersonaSelect}
              selectedPersonaId={selectedPersona?.id}
            />
          </div>

          {/* Selected Persona Info */}
          {selectedPersona && (
            <div className="bg-ponte-secondary rounded-lg shadow-md p-6 mb-8 border border-ponte-border">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedPersona.images[0]}
                  alt={selectedPersona.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/generic_secretary_stock_image.jpg';
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-ponte-text">
                    {selectedPersona.name}
                  </h3>
                  <p className="text-sm text-ponte-textMuted">
                    {selectedPersona.category} • ⭐ {selectedPersona.rating}
                  </p>
                  <p className="text-xs text-ponte-textLight">
                    {selectedPersona.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Form */}
          <div className="bg-ponte-secondary rounded-lg shadow-md p-8 border border-ponte-border">
            <SubmissionForm
              onSubmission={handleSubmission}
              isLoading={isLoading}
            />
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {videoUrl && <VideoPlayer src={videoUrl} />}
          </div>
        </div>
      </div>
    </main>
  );
}
