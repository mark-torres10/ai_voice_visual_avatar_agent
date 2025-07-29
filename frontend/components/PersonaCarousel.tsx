'use client';

import { useState, useEffect } from 'react';
import { Persona } from '@/lib/personas';

interface PersonaCarouselProps {
  personas: Persona[];
  onPersonaSelect?: (persona: Persona) => void;
  selectedPersonaId?: string;
}

export default function PersonaCarousel({
  personas,
  onPersonaSelect,
  selectedPersonaId,
}: PersonaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset carousel index when personas change
  useEffect(() => {
    if (currentIndex >= personas.length && personas.length > 0) {
      setCurrentIndex(0);
    }
  }, [personas.length, currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === personas.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? personas.length - 1 : prevIndex - 1
    );
  };

  const handlePersonaClick = (persona: Persona) => {
    onPersonaSelect?.(persona);
  };

  // Don't render if no personas
  if (personas.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center text-ponte-text">
        Choose Your AI Avatar
      </h2>

      <div className="relative">
        {/* Navigation Buttons - only show if more than one persona */}
        {personas.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-ponte-backgroundLight hover:bg-ponte-secondary rounded-full p-2 shadow-lg transition-all duration-200"
              aria-label="Previous persona"
            >
              <svg
                className="w-6 h-6 text-ponte-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-ponte-backgroundLight hover:bg-ponte-secondary rounded-full p-2 shadow-lg transition-all duration-200"
              aria-label="Next persona"
            >
              <svg
                className="w-6 h-6 text-ponte-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {personas.map((persona) => (
              <div key={persona.id} className="w-full flex-shrink-0 px-4">
                <div
                  className={`bg-ponte-secondary rounded-lg shadow-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    selectedPersonaId === persona.id
                      ? 'border-ponte-accent shadow-ponte-accentLight'
                      : 'border-ponte-border hover:border-ponte-accentLight'
                  }`}
                  onClick={() => handlePersonaClick(persona)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={persona.images[0]}
                        alt={persona.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-ponte-border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/generic_secretary_stock_image.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-ponte-text">
                            {persona.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <span className="text-ponte-yellow">⭐</span>
                            <span className="text-sm font-medium text-ponte-textMuted">
                              {persona.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-ponte-textMuted">
                          {persona.category}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-ponte-textLight">
                            {persona.bookings.toLocaleString()} bookings
                          </span>
                          <div className="flex items-center space-x-1">
                            {persona.availabilityStatus === 'available' && (
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                            {persona.availabilityStatus === 'available_soon' && (
                              <span className="w-2 h-2 bg-ponte-yellow rounded-full"></span>
                            )}
                            {persona.availabilityStatus === 'unavailable' && (
                              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            )}
                            <span className="text-xs text-ponte-textLight capitalize">
                              {persona.availabilityStatus?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {persona.description && (
                      <p className="text-sm text-ponte-textLight mb-4 line-clamp-2">
                        {persona.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-ponte-textMuted">From </span>
                        <span className="text-ponte-accent font-semibold">
                          ${persona.priceRange.min.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {persona.expertise.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-ponte-accentLight text-ponte-accent text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {persona.expertise.length > 2 && (
                          <span className="px-2 py-1 bg-ponte-lightGray text-ponte-textLight text-xs rounded-full">
                            +{persona.expertise.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator - only show if more than one persona */}
        {personas.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {personas.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-ponte-accent'
                    : 'bg-ponte-lightGray hover:bg-ponte-textMuted'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
