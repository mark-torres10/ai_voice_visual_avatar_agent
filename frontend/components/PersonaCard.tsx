'use client';

import { useState } from 'react';
import { Persona } from '@/lib/personas';

interface PersonaCardProps {
  persona: Persona;
  isSelected?: boolean;
  onPersonaClick?: (persona: Persona) => void;
  className?: string;
}

export default function PersonaCard({
  persona,
  isSelected = false,
  onPersonaClick,
  className = '',
}: PersonaCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === persona.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? persona.images.length - 1 : prevIndex - 1
    );
  };

  const handleCardClick = () => {
    onPersonaClick?.(persona);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Future implementation - for now just prevent event propagation
    console.log('Book Avatar clicked for:', persona.name);
  };

  return (
    <div
      data-testid="persona-card"
      className={`relative group cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-105' : 'hover:scale-102'
      } ${className}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Border */}
      <div
        className={`absolute inset-0 rounded-lg p-[2px] transition-all duration-300 ${
          isSelected
            ? 'bg-gradient-to-r from-ponte-accent via-ponte-yellow to-ponte-accent'
            : isHovered
              ? 'bg-gradient-to-r from-ponte-accent/60 via-ponte-yellow/60 to-ponte-accent/60'
              : 'bg-transparent'
        }`}
      >
        <div className="w-full h-full bg-ponte-secondary rounded-lg" />
      </div>

      {/* Card Content */}
      <div className="relative bg-ponte-secondary rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        {/* Persona Image Section */}
        <div className="relative mb-4 group/image">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={persona.images[currentImageIndex]}
              alt={`${persona.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/generic_secretary_stock_image.jpg';
              }}
            />

            {/* Category Tag */}
            <div className="absolute top-2 left-2 bg-ponte-backgroundLight/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-ponte-yellow">
              {persona.category}
            </div>

            {/* Rating */}
            <div className="absolute top-2 right-2 bg-ponte-backgroundLight/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-medium text-ponte-yellow">
              ⭐ {persona.rating}
            </div>

            {/* Availability Status */}
            <div
              className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                persona.availabilityStatus === 'available'
                  ? 'bg-green-600/90 text-white'
                  : persona.availabilityStatus === 'available_soon'
                    ? 'bg-yellow-600/90 text-white'
                    : 'bg-red-600/90 text-white'
              }`}
            >
              {persona.availabilityStatus === 'available'
                ? 'Available'
                : persona.availabilityStatus === 'available_soon'
                  ? 'Available Soon'
                  : 'Unavailable'}
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-ponte-accent/90 rounded-full p-3 transform scale-90 group-hover/image:scale-100 transition-transform duration-200">
                <svg
                  className="w-6 h-6 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Image Navigation */}
            {persona.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-ponte-backgroundLight/80 hover:bg-ponte-secondary/90 rounded-full p-2 opacity-0 group-hover/image:opacity-100 transition-all duration-200"
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
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-ponte-backgroundLight/80 hover:bg-ponte-secondary/90 rounded-full p-2 opacity-0 group-hover/image:opacity-100 transition-all duration-200"
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

                {/* Image Dots Indicator */}
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  {persona.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        index === currentImageIndex
                          ? 'bg-ponte-accent'
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Persona Info */}
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-ponte-text mb-1">
              {persona.name}
            </h3>
            <div className="flex items-center justify-center space-x-2 text-sm text-ponte-textMuted mb-2">
              <span>{persona.bookings} bookings</span>
              <span>•</span>
              <span>
                ${persona.priceRange.min.toLocaleString()} - $
                {persona.priceRange.max.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-1 justify-center">
            {persona.expertise.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-ponte-backgroundLight rounded-full text-xs text-ponte-textLight"
              >
                {skill}
              </span>
            ))}
            {persona.expertise.length > 3 && (
              <span className="px-2 py-1 bg-ponte-backgroundLight rounded-full text-xs text-ponte-textLight">
                +{persona.expertise.length - 3} more
              </span>
            )}
          </div>

          {/* Description */}
          {persona.description && (
            <p className="text-sm text-ponte-textLight text-center line-clamp-2 leading-relaxed">
              {persona.description}
            </p>
          )}

          {/* Book Avatar Button */}
          <button
            onClick={handleBookClick}
            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              isSelected
                ? 'bg-ponte-accent text-white hover:bg-ponte-accentDark'
                : 'bg-ponte-backgroundLight text-ponte-text hover:bg-ponte-secondary border border-ponte-border hover:border-ponte-borderLight'
            }`}
          >
            Book Avatar
          </button>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 bg-ponte-accent rounded-full p-1">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
