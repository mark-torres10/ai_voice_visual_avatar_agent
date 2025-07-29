'use client';

import { useState } from 'react';
import { personas, Persona } from '@/lib/personas';

interface PersonaCarouselProps {
  onPersonaSelect?: (persona: Persona) => void;
  selectedPersonaId?: string;
}

export default function PersonaCarousel({
  onPersonaSelect,
  selectedPersonaId,
}: PersonaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Choose Your AI Avatar
      </h2>

      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
          aria-label="Previous persona"
        >
          <svg
            className="w-6 h-6 text-gray-600"
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
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
          aria-label="Next persona"
        >
          <svg
            className="w-6 h-6 text-gray-600"
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
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {personas.map((persona) => (
              <div
                key={persona.id}
                className="w-full flex-shrink-0 px-4"
                onClick={() => handlePersonaClick(persona)}
              >
                <div
                  className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                    selectedPersonaId === persona.id
                      ? 'ring-2 ring-blue-500 shadow-xl'
                      : ''
                  }`}
                >
                  {/* Persona Image */}
                  <div className="relative mb-4">
                    <img
                      src={persona.images[0]}
                      alt={persona.name}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/generic_secretary_stock_image.jpg';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-sm font-medium">
                      ⭐ {persona.rating}
                    </div>
                    <div
                      className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                        persona.availabilityStatus === 'available'
                          ? 'bg-green-100 text-green-800'
                          : persona.availabilityStatus === 'available_soon'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {persona.availabilityStatus === 'available'
                        ? 'Available'
                        : persona.availabilityStatus === 'available_soon'
                          ? 'Available Soon'
                          : 'Unavailable'}
                    </div>
                  </div>

                  {/* Persona Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {persona.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {persona.category}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      {persona.bookings} bookings • $
                      {persona.priceRange.min.toLocaleString()} - $
                      {persona.priceRange.max.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {persona.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {personas.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-blue-500 w-4'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
