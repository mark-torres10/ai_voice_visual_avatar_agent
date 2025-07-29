'use client';

import React, { useState, useEffect } from 'react';
import { filterOptions } from '@/lib/personas';

interface FilterState {
  category?: string;
  availability?: string;
  priceRange?: { min: number; max: number };
}

interface FilterPanelProps {
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FilterPanel({ 
  onFiltersChange, 
  className = '', 
  isMobile = false,
  isOpen = true,
  onClose 
}: FilterPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(0);

  // Close modal on escape key
  useEffect(() => {
    if (isMobile && isOpen) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose?.();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobile, isOpen, onClose]);

  const handleCategoryChange = (category: string) => {
    const newCategory = category === selectedCategory ? '' : category;
    setSelectedCategory(newCategory);
    updateFilters({ category: newCategory || undefined });
  };

  const handleAvailabilityChange = (availability: string) => {
    const newAvailability = availability === selectedAvailability ? '' : availability;
    setSelectedAvailability(newAvailability);
    updateFilters({ availability: newAvailability || undefined });
  };

  const handlePriceRangeChange = (rangeIndex: number) => {
    const newRangeIndex = rangeIndex === selectedPriceRange ? 0 : rangeIndex;
    setSelectedPriceRange(newRangeIndex);
    const priceRange = newRangeIndex > 0 ? filterOptions.priceRanges[newRangeIndex - 1] : undefined;
    updateFilters({ 
      priceRange: priceRange ? { min: priceRange.min, max: priceRange.max } : undefined 
    });
  };

  const updateFilters = (newFilter: Partial<FilterState>) => {
    const filters: FilterState = {
      category: selectedCategory || undefined,
      availability: selectedAvailability || undefined,
      priceRange: selectedPriceRange > 0 
        ? { min: filterOptions.priceRanges[selectedPriceRange - 1].min, max: filterOptions.priceRanges[selectedPriceRange - 1].max }
        : undefined,
      ...newFilter
    };
    
    // Clean up undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof FilterState] === undefined) {
        delete filters[key as keyof FilterState];
      }
    });
    
    onFiltersChange(filters);
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedAvailability('');
    setSelectedPriceRange(0);
    onFiltersChange({});
  };

  const hasActiveFilters = selectedCategory || selectedAvailability || selectedPriceRange > 0;

  const panelContent = (
    <div className={`bg-ponte-secondary rounded-lg border border-ponte-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-ponte-text">Filters</h2>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-ponte-accent hover:text-ponte-accentDark transition-colors"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          )}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-ponte-textMuted hover:text-ponte-text hover:bg-ponte-backgroundLight transition-colors"
              aria-label="Close filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Avatar Type Filter */}
        <div>
          <h3 className="text-lg font-medium text-ponte-text mb-4">Avatar Type</h3>
          <div className="space-y-3">
            {filterOptions.categories.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() => handleCategoryChange(category)}
                    className="sr-only"
                    aria-describedby={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all ${
                    selectedCategory === category
                      ? 'bg-ponte-accent border-ponte-accent'
                      : 'border-ponte-lightGray hover:border-ponte-accent'
                  }`}>
                    {selectedCategory === category && (
                      <svg
                        className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span 
                  className="text-ponte-textMuted group-hover:text-ponte-text transition-colors select-none"
                  id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <h3 className="text-lg font-medium text-ponte-text mb-4">Availability</h3>
          <div className="space-y-3">
            {filterOptions.availability.map((availability) => (
              <label
                key={availability}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="radio"
                    name="availability"
                    checked={selectedAvailability === availability}
                    onChange={() => handleAvailabilityChange(availability)}
                    className="sr-only"
                    aria-describedby={`availability-${availability.replace(/\s+/g, '-').toLowerCase()}`}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                    selectedAvailability === availability
                      ? 'border-ponte-accent'
                      : 'border-ponte-lightGray hover:border-ponte-accent'
                  }`}>
                    {selectedAvailability === availability && (
                      <div className="w-2.5 h-2.5 bg-ponte-accent rounded-full absolute top-1 left-1"></div>
                    )}
                  </div>
                </div>
                <span 
                  className="text-ponte-textMuted group-hover:text-ponte-text transition-colors select-none flex items-center"
                  id={`availability-${availability.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {availability}
                  {availability === 'Available Now' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                      ●
                    </span>
                  )}
                  {availability === 'Available Soon' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-ponte-yellow text-ponte-background">
                      ●
                    </span>
                  )}
                  {availability === 'Unavailable' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                      ●
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="text-lg font-medium text-ponte-text mb-4">Price Range</h3>
          <div className="space-y-4">
            {/* Custom Range Slider */}
            <div className="px-1">
              <input
                type="range"
                min="0"
                max={filterOptions.priceRanges.length}
                value={selectedPriceRange}
                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-ponte-lightGray rounded-lg appearance-none cursor-pointer slider"
                aria-label="Price range slider"
                aria-describedby="price-range-description"
              />
              <div className="flex justify-between text-xs text-ponte-textLight mt-2">
                <span>Any Price</span>
                <span>$100k+</span>
              </div>
            </div>
            
            {/* Price Range Options */}
            <div className="space-y-2" id="price-range-description">
              <div className="text-sm text-ponte-textMuted">
                {selectedPriceRange === 0 && 'Any price range'}
                {selectedPriceRange > 0 && (
                  <span className="text-ponte-accent font-medium">
                    {filterOptions.priceRanges[selectedPriceRange - 1].label}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {filterOptions.priceRanges.map((range, index) => (
                  <button
                    key={range.label}
                    onClick={() => handlePriceRangeChange(index + 1)}
                    className={`text-left p-2 rounded transition-colors ${
                      selectedPriceRange === index + 1
                        ? 'bg-ponte-accentLight text-ponte-accent'
                        : 'text-ponte-textLight hover:text-ponte-textMuted hover:bg-ponte-backgroundLight'
                    }`}
                    aria-pressed={selectedPriceRange === index + 1}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-8 pt-6 border-t border-ponte-border">
          <h4 className="text-sm font-medium text-ponte-text mb-3">Active Filters:</h4>
          <div className="space-y-2">
            {selectedCategory && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-ponte-textMuted">Type:</span>
                <span className="text-ponte-accent">{selectedCategory}</span>
              </div>
            )}
            {selectedAvailability && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-ponte-textMuted">Availability:</span>
                <span className="text-ponte-accent">{selectedAvailability}</span>
              </div>
            )}
            {selectedPriceRange > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-ponte-textMuted">Price:</span>
                <span className="text-ponte-accent">
                  {filterOptions.priceRanges[selectedPriceRange - 1].label}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #dd3c61;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #dd3c61;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );

  // Mobile modal wrapper
  if (isMobile) {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div className="fixed inset-x-0 bottom-0 h-5/6 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {panelContent}
          </div>
        </div>
      </div>
    );
  }

  return panelContent;
}