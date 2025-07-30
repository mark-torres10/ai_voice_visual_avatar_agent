'use client';

import { useState } from 'react';
import { personas, Persona } from '@/lib/personas';
import { PersonaCard } from './persona';

interface PersonaCarouselProps {
  onPersonaSelect?: (persona: Persona) => void;
  selectedPersonaId?: string;
}

export default function PersonaCarousel({
  onPersonaSelect,
  selectedPersonaId,
}: PersonaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 4; // Show 4 cards at once
  const totalSlides = Math.ceil(personas.length / cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const handlePersonaSelect = (persona: Persona) => {
    onPersonaSelect?.(persona);
  };

  const getCurrentPersonas = () => {
    const startIndex = currentIndex * cardsPerView;
    return personas.slice(startIndex, startIndex + cardsPerView);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center text-ponte-text">
        Choose Your AI Avatar
      </h2>

      <div className="relative">
        {/* Navigation Buttons */}
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

        {/* Carousel Container */}
        <div className="overflow-hidden rounded-lg">
          <div className="grid grid-cols-4 gap-4 px-4">
            {getCurrentPersonas().map((persona) => (
              <div key={persona.id} className="w-full">
                <PersonaCard
                  persona={persona}
                  isSelected={selectedPersonaId === persona.id}
                  onSelect={handlePersonaSelect}
                  className="w-full h-96" // Fixed height for consistent card sizing
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-ponte-accent w-4'
                  : 'bg-ponte-lightGray hover:bg-ponte-textLight'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
