'use client';

import { useState } from 'react';
import SubmissionForm from '@/components/SubmissionForm';
import VideoPlayer from '@/components/VideoPlayer';
import PersonaCarousel from '@/components/PersonaCarousel';
import FilterPanel from '@/components/FilterPanel';
import { Persona, personas, filterPersonas } from '@/lib/personas';

interface FilterState {
  category?: string;
  availability?: string;
  priceRange?: { min: number; max: number };
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter personas based on current filters
  const filteredPersonas = filterPersonas(personas, filters);

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

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Clear selected persona if it's not in the filtered results
    if (selectedPersona) {
      const isSelectedPersonaInResults = filteredPersonas.some(
        p => p.id === selectedPersona.id
      );
      if (!isSelectedPersonaInResults) {
        setSelectedPersona(null);
      }
    }
  };

  return (
    <main className="min-h-screen bg-ponte-background">
      <div className="flex">
        {/* Left Sidebar - Filter Panel (Desktop) */}
        <div className="hidden lg:block w-80 h-screen sticky top-0 bg-ponte-background border-r border-ponte-border">
          <div className="p-6">
            <FilterPanel 
              onFiltersChange={handleFiltersChange}
              className="h-fit"
            />
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <FilterPanel 
          onFiltersChange={handleFiltersChange}
          isMobile={true}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 py-8">
          <div className="container mx-auto px-4 lg:px-8">
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
                {/* Results Count */}
                <div className="mt-4 text-sm text-ponte-textLight">
                  {filteredPersonas.length} avatar{filteredPersonas.length !== 1 ? 's' : ''} available
                  {Object.keys(filters).length > 0 && (
                    <span className="text-ponte-accent"> (filtered)</span>
                  )}
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-6">
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-ponte-secondary border border-ponte-border rounded-lg text-ponte-text hover:bg-ponte-backgroundLight transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  <span>Filters</span>
                  {Object.keys(filters).length > 0 && (
                    <span className="bg-ponte-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {Object.keys(filters).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Persona Carousel */}
              <div className="mb-8">
                <PersonaCarousel
                  personas={filteredPersonas}
                  onPersonaSelect={handlePersonaSelect}
                  selectedPersonaId={selectedPersona?.id}
                />
              </div>

              {/* No Results Message */}
              {filteredPersonas.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-ponte-text mb-2">
                    No avatars found
                  </h3>
                  <p className="text-ponte-textMuted mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={() => setFilters({})}
                    className="px-4 py-2 bg-ponte-accent text-white rounded-lg hover:bg-ponte-accentDark transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

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
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-ponte-text">
                          {selectedPersona.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {selectedPersona.availabilityStatus === 'available' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Available Now
                            </span>
                          )}
                          {selectedPersona.availabilityStatus === 'available_soon' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-ponte-yellow text-ponte-background">
                              Available Soon
                            </span>
                          )}
                          {selectedPersona.availabilityStatus === 'unavailable' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-ponte-textMuted">
                        {selectedPersona.category} • ⭐ {selectedPersona.rating}
                      </p>
                      <p className="text-xs text-ponte-textLight mt-1">
                        {selectedPersona.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-ponte-textLight">
                          <span className="font-medium">Price:</span> ${selectedPersona.priceRange.min.toLocaleString()} - ${selectedPersona.priceRange.max.toLocaleString()}
                        </div>
                        <div className="text-xs text-ponte-textLight">
                          {selectedPersona.bookings.toLocaleString()} bookings
                        </div>
                      </div>
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
        </div>
      </div>
    </main>
  );
}
