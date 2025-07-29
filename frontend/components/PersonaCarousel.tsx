'use client';

import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { personas, Persona } from '@/lib/personas';

interface PersonaCarouselProps {
  onPersonaSelect?: (persona: Persona) => void;
  selectedPersonaId?: string;
}

interface PersonaCardProps {
  persona: Persona;
  isSelected: boolean;
  onClick: (persona: Persona) => void;
}

// Individual PersonaCard component for better organization
function PersonaCard({ persona, isSelected, onClick }: PersonaCardProps) {
  return (
    <div
      className={`bg-ponte-secondary rounded-lg shadow-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        isSelected
          ? 'ring-2 ring-ponte-accent shadow-xl transform scale-105'
          : ''
      }`}
      onClick={() => onClick(persona)}
    >
      {/* Persona Image */}
      <div className="relative mb-3">
        <img
          src={persona.images[0]}
          alt={persona.name}
          className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/generic_secretary_stock_image.jpg';
          }}
        />
        <div className="absolute top-2 right-2 bg-ponte-backgroundLight rounded-full px-2 py-1 text-sm font-medium text-ponte-yellow">
          ⭐ {persona.rating}
        </div>
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
            persona.availabilityStatus === 'available'
              ? 'bg-green-600 text-white'
              : persona.availabilityStatus === 'available_soon'
                ? 'bg-yellow-600 text-white'
                : 'bg-red-600 text-white'
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
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-ponte-text mb-1">
          {persona.name}
        </h3>
        <p className="text-xs sm:text-sm text-ponte-textMuted mb-2">
          {persona.category}
        </p>
        <p className="text-xs text-ponte-textLight mb-3">
          {persona.bookings} bookings • $
          {persona.priceRange.min.toLocaleString()} - $
          {persona.priceRange.max.toLocaleString()}
        </p>
        <p className="text-xs sm:text-sm text-ponte-text line-clamp-2">
          {persona.description}
        </p>
      </div>
    </div>
  );
}

export default function PersonaCarousel({
  onPersonaSelect,
  selectedPersonaId,
}: PersonaCarouselProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const handlePersonaClick = (persona: Persona) => {
    onPersonaSelect?.(persona);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.activeIndex);
  };

  const goToNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const goToPrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const toggleAutoplay = () => {
    if (swiperInstance) {
      if (isAutoplayPaused) {
        swiperInstance.autoplay.start();
        setIsAutoplayPaused(false);
      } else {
        swiperInstance.autoplay.stop();
        setIsAutoplayPaused(true);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-ponte-text">
          Choose Your AI Avatar
        </h2>
        
        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Autoplay Toggle */}
          <button
            onClick={toggleAutoplay}
            className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-ponte-secondary hover:bg-ponte-accent rounded-lg transition-all duration-200"
            aria-label={isAutoplayPaused ? 'Start autoplay' : 'Pause autoplay'}
          >
            <span className="text-xs text-ponte-text">
              {isAutoplayPaused ? '▶️' : '⏸️'}
            </span>
            <span className="text-xs text-ponte-textMuted">Auto</span>
          </button>

          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={goToPrev}
              className="p-2 bg-ponte-secondary hover:bg-ponte-accent rounded-full transition-all duration-200 group"
              aria-label="Previous slide"
            >
              <svg
                className="w-5 h-5 text-ponte-text group-hover:text-white"
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
              onClick={goToNext}
              className="p-2 bg-ponte-secondary hover:bg-ponte-accent rounded-full transition-all duration-200 group"
              aria-label="Next slide"
            >
              <svg
                className="w-5 h-5 text-ponte-text group-hover:text-white"
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
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <Swiper
          modules={[Grid, Pagination, Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          grid={{
            rows: 1,
            fill: 'row',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            bulletActiveClass: 'swiper-pagination-bullet-active-custom',
            bulletClass: 'swiper-pagination-bullet-custom',
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          breakpoints={{
            480: {
              slidesPerView: 2,
              grid: {
                rows: 1,
              },
            },
            768: {
              slidesPerView: 2,
              grid: {
                rows: 2,
              },
            },
            1024: {
              slidesPerView: 3,
              grid: {
                rows: 2,
              },
            },
            1280: {
              slidesPerView: 4,
              grid: {
                rows: 2,
              },
            },
          }}
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
          className="persona-carousel"
        >
          {personas.map((persona) => (
            <SwiperSlide key={persona.id}>
              <PersonaCard
                persona={persona}
                isSelected={selectedPersonaId === persona.id}
                onClick={handlePersonaClick}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between mt-4 text-sm text-ponte-textMuted">
        <div className="flex items-center space-x-4">
          <span>
            Slide {currentSlide + 1} of {Math.ceil(personas.length / 2)}
          </span>
          <span>•</span>
          <span>{personas.length} personas available</span>
        </div>
        
        {/* Responsive indicator */}
        <div className="hidden sm:flex items-center space-x-2">
          <div className="w-2 h-2 bg-ponte-accent rounded-full"></div>
          <span className="text-xs">Auto-rotating</span>
        </div>
      </div>

      {/* Custom styles for pagination */}
      <style jsx global>{`
        .persona-carousel .swiper-pagination {
          position: relative !important;
          margin-top: 1rem;
        }
        
        .swiper-pagination-bullet-custom {
          width: 8px;
          height: 8px;
          background: rgba(161, 161, 170, 0.5);
          border-radius: 50%;
          opacity: 1;
          margin: 0 4px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .swiper-pagination-bullet-active-custom {
          background: #dd3c61;
          width: 24px;
          border-radius: 4px;
          transform: scale(1.1);
        }
        
        .swiper-pagination-bullet-custom:hover {
          background: rgba(221, 60, 97, 0.7);
          transform: scale(1.1);
        }

        /* Smooth transitions for all carousel elements */
        .persona-carousel .swiper-slide {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .persona-carousel .swiper-slide-active {
          z-index: 1;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .persona-carousel .swiper-pagination {
            margin-top: 0.5rem;
          }
          
          .swiper-pagination-bullet-custom {
            width: 6px;
            height: 6px;
            margin: 0 2px;
          }
          
          .swiper-pagination-bullet-active-custom {
            width: 18px;
          }
        }
      `}</style>
    </div>
  );
}
