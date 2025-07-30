'use client';

import { useState } from 'react';
import { Persona } from '@/lib/personas';

interface PersonaCardProps {
  persona: Persona;
  isSelected?: boolean;
  onSelect?: (persona: Persona) => void;
  className?: string;
}

export default function PersonaCard({
  persona,
  isSelected = false,
  onSelect,
  className = '',
}: PersonaCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === persona.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? persona.images.length - 1 : prev - 1
    );
  };

  const handleCardClick = () => {
    onSelect?.(persona);
  };

  const handleImageNavigation = (
    e: React.MouseEvent,
    direction: 'next' | 'prev'
  ) => {
    e.stopPropagation();
    if (direction === 'next') {
      nextImage();
    } else {
      prevImage();
    }
  };

  const getAvailabilityColor = (status?: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-600 text-white';
      case 'available_soon':
        return 'bg-yellow-600 text-white';
      case 'unavailable':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getAvailabilityText = (status?: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'available_soon':
        return 'Available Soon';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  return (
    <div
      className={`
        relative bg-ponte-secondary rounded-xl shadow-lg overflow-hidden cursor-pointer
        transition-all duration-300 ease-in-out transform
        ${isSelected ? 'scale-105 ring-2 ring-ponte-accent shadow-2xl' : ''}
        ${isHovered ? 'scale-102 shadow-xl' : ''}
        ${className}
      `}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Border Effect */}
      <div
        className={`
          absolute inset-0 rounded-xl transition-opacity duration-300
          ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background:
            'linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899, #f59e0b)',
          padding: '2px',
        }}
      >
        <div className="bg-ponte-secondary rounded-xl h-full w-full" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Image Container - Takes up most of the card height */}
        <div className="relative flex-1 group">
          <img
            src={persona.images[currentImageIndex]}
            alt={`${persona.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/generic_secretary_stock_image.jpg';
            }}
          />

          {/* Image Navigation Arrows */}
          {persona.images.length > 1 && (
            <>
              <button
                onClick={(e) => handleImageNavigation(e, 'prev')}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-ponte-backgroundLight/80 hover:bg-ponte-backgroundLight rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Previous image"
              >
                <svg
                  className="w-4 h-4 text-ponte-text"
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
                onClick={(e) => handleImageNavigation(e, 'next')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-ponte-backgroundLight/80 hover:bg-ponte-backgroundLight rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Next image"
              >
                <svg
                  className="w-4 h-4 text-ponte-text"
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

          {/* Image Indicators */}
          {persona.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {persona.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'bg-ponte-accent w-4'
                      : 'bg-ponte-lightGray/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Overlay Elements */}
          <div className="absolute top-2 right-2 bg-ponte-backgroundLight/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-medium text-ponte-yellow">
            ⭐ {persona.rating}
          </div>

          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(
              persona.availabilityStatus
            )}`}
          >
            {getAvailabilityText(persona.availabilityStatus)}
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-2 left-2 bg-ponte-backgroundLight/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-ponte-text">
            {persona.category}
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-ponte-accent/90 rounded-full p-3">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Persona Information - Compact section at bottom */}
        <div className="p-3 bg-ponte-secondary">
          {/* Name and Basic Info */}
          <div className="text-center mb-2">
            <h3 className="text-sm font-semibold text-ponte-text mb-1">
              {persona.name}
            </h3>
            <p className="text-xs text-ponte-textMuted mb-1">
              {persona.bookings.toLocaleString()} bookings
            </p>
            <p className="text-xs text-ponte-textLight mb-2">
              ${persona.priceRange.min.toLocaleString()} - $
              {persona.priceRange.max.toLocaleString()}
            </p>
          </div>

          {/* Expertise Tags - Compact display */}
          <div className="flex flex-wrap gap-1 justify-center mb-2">
            {persona.expertise.slice(0, 2).map((skill, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 bg-ponte-backgroundLight text-ponte-text text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {persona.expertise.length > 2 && (
              <span className="px-1.5 py-0.5 bg-ponte-backgroundLight text-ponte-text text-xs rounded-full">
                +{persona.expertise.length - 2} more
              </span>
            )}
          </div>

          {/* Book Avatar Button */}
          <button
            className={`
              w-full py-1.5 px-3 rounded-lg font-medium text-xs transition-all duration-200
              ${
                persona.isAvailable
                  ? 'bg-ponte-accent hover:bg-ponte-accent/90 text-white'
                  : 'bg-ponte-lightGray text-ponte-textMuted cursor-not-allowed'
              }
            `}
            disabled={!persona.isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (persona.isAvailable) {
                onSelect?.(persona);
              }
            }}
          >
            {persona.isAvailable ? 'Book Avatar' : 'Unavailable'}
          </button>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-20">
          <div className="bg-ponte-accent rounded-full p-1">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
