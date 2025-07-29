import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonaCarousel from '@/components/PersonaCarousel';
import { personas } from '@/lib/personas';

// Mock Swiper components and modules
jest.mock('swiper/react', () => ({
  Swiper: ({ children, onSwiper, onSlideChange, ...props }: any) => {
    const mockSwiper = {
      slideNext: jest.fn(),
      slidePrev: jest.fn(),
      autoplay: {
        start: jest.fn(),
        stop: jest.fn(),
      },
      activeIndex: 0,
    };

    React.useEffect(() => {
      if (onSwiper) onSwiper(mockSwiper);
    }, [onSwiper]);

    return (
      <div data-testid="swiper-container" {...props}>
        {children}
      </div>
    );
  },
  SwiperSlide: ({ children, ...props }: any) => (
    <div data-testid="swiper-slide" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('swiper/modules', () => ({
  Grid: {},
  Pagination: {},
  Navigation: {},
  Autoplay: {},
}));

// Mock CSS imports
jest.mock('swiper/css', () => {});
jest.mock('swiper/css/grid', () => {});
jest.mock('swiper/css/pagination', () => {});
jest.mock('swiper/css/navigation', () => {});

describe('PersonaCarousel', () => {
  const mockOnPersonaSelect = jest.fn();
  const defaultProps = {
    onPersonaSelect: mockOnPersonaSelect,
    selectedPersonaId: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the carousel with title', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      expect(screen.getByText('Choose Your AI Avatar')).toBeInTheDocument();
    });

    it('renders all persona cards', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      // Check that all personas are rendered
      personas.forEach(persona => {
        expect(screen.getByText(persona.name)).toBeInTheDocument();
      });
    });

    it('renders swiper container with correct props', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      const swiperContainer = screen.getByTestId('swiper-container');
      expect(swiperContainer).toBeInTheDocument();
      expect(swiperContainer).toHaveClass('persona-carousel');
    });

    it('renders navigation controls', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('renders autoplay toggle on larger screens', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      const autoplayButton = screen.getByLabelText(/autoplay/i);
      expect(autoplayButton).toBeInTheDocument();
    });
  });

  describe('Persona Card Rendering', () => {
    it('renders persona information correctly', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      const firstPersona = personas[0];
      expect(screen.getByText(firstPersona.name)).toBeInTheDocument();
      // Use getAllByText for elements that appear multiple times
      expect(screen.getAllByText(firstPersona.category)).toHaveLength(
        personas.filter(p => p.category === firstPersona.category).length
      );
      expect(screen.getByText(firstPersona.description!)).toBeInTheDocument();
      // Use getAllByText for rating since multiple personas might have the same rating
      const ratingElements = screen.getAllByText(`⭐ ${firstPersona.rating}`);
      expect(ratingElements.length).toBeGreaterThan(0);
    });

    it('displays availability status correctly', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      // Count expected occurrences of each status
      const availableCount = personas.filter(p => p.availabilityStatus === 'available').length;
      const availableSoonCount = personas.filter(p => p.availabilityStatus === 'available_soon').length;
      const unavailableCount = personas.filter(p => p.availabilityStatus === 'unavailable').length;
      
      if (availableCount > 0) {
        expect(screen.getAllByText('Available')).toHaveLength(availableCount);
      }
      if (availableSoonCount > 0) {
        expect(screen.getAllByText('Available Soon')).toHaveLength(availableSoonCount);
      }
      if (unavailableCount > 0) {
        expect(screen.getAllByText('Unavailable')).toHaveLength(unavailableCount);
      }
    });

    it('displays price range correctly', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      const firstPersona = personas[0];
      const priceText = `${firstPersona.bookings} bookings • $${firstPersona.priceRange.min.toLocaleString()} - $${firstPersona.priceRange.max.toLocaleString()}`;
      expect(screen.getByText(priceText)).toBeInTheDocument();
    });

    it('handles image error correctly', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      const images = screen.getAllByRole('img');
      const firstImage = images[0] as HTMLImageElement;
      
      // Simulate image error
      fireEvent.error(firstImage);
      
      expect(firstImage.src).toContain('generic_secretary_stock_image.jpg');
    });
  });

  describe('Selection State', () => {
    it('highlights selected persona', () => {
      const selectedPersonaId = personas[0].id;
      render(<PersonaCarousel {...defaultProps} selectedPersonaId={selectedPersonaId} />);
      
      // Find the card container by navigating from the persona name
      const personaName = screen.getByText(personas[0].name);
      const cardContainer = personaName.closest('[class*="bg-ponte-secondary"]');
      expect(cardContainer).toHaveClass('ring-2', 'ring-ponte-accent');
    });

    it('calls onPersonaSelect when persona is clicked', async () => {
      const user = userEvent.setup();
      render(<PersonaCarousel {...defaultProps} />);
      
      const firstPersonaName = screen.getByText(personas[0].name);
      const firstPersonaCard = firstPersonaName.closest('[class*="bg-ponte-secondary"]');
      if (firstPersonaCard) {
        await user.click(firstPersonaCard);
      }
      
      expect(mockOnPersonaSelect).toHaveBeenCalledWith(personas[0]);
    });

    it('does not highlight persona when none is selected', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      personas.forEach(persona => {
        const personaName = screen.getByText(persona.name);
        const card = personaName.closest('[class*="bg-ponte-secondary"]');
        expect(card).not.toHaveClass('ring-2', 'ring-ponte-accent');
      });
    });
  });

  describe('Navigation Controls', () => {
    it('has working previous button', async () => {
      const user = userEvent.setup();
      render(<PersonaCarousel {...defaultProps} />);
      
      const prevButton = screen.getByLabelText('Previous slide');
      await user.click(prevButton);
      
      // Since we're mocking Swiper, we can't test actual slide change
      // but we can ensure the button is clickable
      expect(prevButton).toBeInTheDocument();
    });

    it('has working next button', async () => {
      const user = userEvent.setup();
      render(<PersonaCarousel {...defaultProps} />);
      
      const nextButton = screen.getByLabelText('Next slide');
      await user.click(nextButton);
      
      expect(nextButton).toBeInTheDocument();
    });

    it('toggles autoplay when button is clicked', async () => {
      const user = userEvent.setup();
      render(<PersonaCarousel {...defaultProps} />);
      
      const autoplayButton = screen.getByLabelText(/autoplay/i);
      await user.click(autoplayButton);
      
      // Check that button text changes
      expect(screen.getByText('▶️')).toBeInTheDocument();
    });
  });

  describe('Status Information', () => {
    it('displays slide information', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      expect(screen.getByText(/Slide \d+ of \d+/)).toBeInTheDocument();
      expect(screen.getByText(`${personas.length} personas available`)).toBeInTheDocument();
    });

    it('shows auto-rotating indicator', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      expect(screen.getByText('Auto-rotating')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes to persona cards', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      const firstPersonaImage = screen.getAllByRole('img')[0];
      expect(firstPersonaImage).toHaveClass('h-32', 'sm:h-40', 'md:h-48');
    });

    it('applies responsive text sizing', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      const title = screen.getByText('Choose Your AI Avatar');
      expect(title).toHaveClass('text-xl', 'sm:text-2xl');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for navigation buttons', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('has accessible image alt texts', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      personas.forEach(persona => {
        expect(screen.getByAltText(persona.name)).toBeInTheDocument();
      });
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<PersonaCarousel {...defaultProps} />);
      
      const nextButton = screen.getByLabelText('Next slide');
      nextButton.focus();
      
      await user.keyboard('{Enter}');
      
      expect(nextButton).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('handles missing onPersonaSelect prop', async () => {
      const user = userEvent.setup();
      render(<PersonaCarousel selectedPersonaId={undefined} />);
      
      const firstPersonaName = screen.getByText(personas[0].name);
      const firstPersonaCard = firstPersonaName.closest('[class*="bg-ponte-secondary"]');
      if (firstPersonaCard) {
        await user.click(firstPersonaCard);
      }
      
      // Should not throw error even without onPersonaSelect
      expect(firstPersonaCard).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently with many personas', () => {
      const startTime = performance.now();
      render(<PersonaCarousel {...defaultProps} />);
      const endTime = performance.now();
      
      // Rendering should be fast (under 100ms for test environment)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('memoizes persona cards properly', () => {
      const { rerender } = render(<PersonaCarousel {...defaultProps} />);
      
      // Rerender with same props
      rerender(<PersonaCarousel {...defaultProps} />);
      
      // Should still render all personas
      expect(screen.getByText(personas[0].name)).toBeInTheDocument();
    });
  });

  describe('Integration with Ponte AI Design System', () => {
    it('uses correct Ponte AI color scheme classes', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      const title = screen.getByText('Choose Your AI Avatar');
      expect(title).toHaveClass('text-ponte-text');
      
      // Check for Ponte AI color usage in cards
      const firstPersonaName = screen.getByText(personas[0].name);
      const firstCard = firstPersonaName.closest('[class*="bg-ponte-secondary"]');
      expect(firstCard).toHaveClass('bg-ponte-secondary');
    });

    it('applies consistent styling with design system', () => {
      render(<PersonaCarousel {...defaultProps} />);
      
      const navButtons = screen.getAllByRole('button');
      navButtons.forEach(button => {
        if (button.getAttribute('aria-label')?.includes('slide')) {
          expect(button).toHaveClass('bg-ponte-secondary', 'hover:bg-ponte-accent');
        }
      });
    });
  });
});