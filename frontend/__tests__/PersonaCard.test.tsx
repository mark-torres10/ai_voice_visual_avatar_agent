import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonaCard from '../components/PersonaCard';
import { Persona } from '../lib/personas';

const mockPersona: Persona = {
  id: 'test-persona',
  name: 'Test Persona',
  category: 'Voice Actor',
  rating: 4.8,
  bookings: 1250,
  priceRange: {
    min: 2500,
    max: 15000,
  },
  expertise: ['Product Launches', 'Training Videos', 'Marketing Content'],
  images: [
    '/test-image-1.jpg',
    '/test-image-2.jpg',
    '/test-image-3.jpg',
  ],
  isAvailable: true,
  availabilityStatus: 'available',
  description: 'Professional voice actor with extensive experience.',
};

const mockPersonaClickHandler = jest.fn();

describe('PersonaCard', () => {
  beforeEach(() => {
    mockPersonaClickHandler.mockClear();
  });

  it('renders persona information correctly', () => {
    render(<PersonaCard persona={mockPersona} />);

    expect(screen.getByText('Test Persona')).toBeInTheDocument();
    expect(screen.getByText('Voice Actor')).toBeInTheDocument();
    expect(screen.getByText('⭐ 4.8')).toBeInTheDocument();
    expect(screen.getByText('1250 bookings')).toBeInTheDocument();
    expect(screen.getByText('$2,500 - $15,000')).toBeInTheDocument();
    expect(screen.getByText('Product Launches')).toBeInTheDocument();
    expect(screen.getByText('Training Videos')).toBeInTheDocument();
    expect(screen.getByText('Marketing Content')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Book Avatar')).toBeInTheDocument();
  });

  it('handles persona click correctly', () => {
    render(
      <PersonaCard
        persona={mockPersona}
        onPersonaClick={mockPersonaClickHandler}
      />
    );

    fireEvent.click(screen.getByRole('img'));
    expect(mockPersonaClickHandler).toHaveBeenCalledWith(mockPersona);
  });

  it('shows selection state when selected', () => {
    render(<PersonaCard persona={mockPersona} isSelected={true} />);

    const cardContainer = screen.getByTestId('persona-card');
    expect(cardContainer).toHaveClass('scale-105');
  });

  it('displays image navigation when multiple images exist', () => {
    render(<PersonaCard persona={mockPersona} />);

    const prevButton = screen.getByLabelText('Previous image');
    const nextButton = screen.getByLabelText('Next image');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('navigates between images correctly', () => {
    render(<PersonaCard persona={mockPersona} />);

    const image = screen.getByRole('img');
    const nextButton = screen.getByLabelText('Next image');

    expect(image).toHaveAttribute('src', '/test-image-1.jpg');

    fireEvent.click(nextButton);
    expect(image).toHaveAttribute('src', '/test-image-2.jpg');

    fireEvent.click(nextButton);
    expect(image).toHaveAttribute('src', '/test-image-3.jpg');

    // Should wrap around to first image
    fireEvent.click(nextButton);
    expect(image).toHaveAttribute('src', '/test-image-1.jpg');
  });

  it('navigates backwards through images correctly', () => {
    render(<PersonaCard persona={mockPersona} />);

    const image = screen.getByRole('img');
    const prevButton = screen.getByLabelText('Previous image');

    expect(image).toHaveAttribute('src', '/test-image-1.jpg');

    // Should wrap around to last image
    fireEvent.click(prevButton);
    expect(image).toHaveAttribute('src', '/test-image-3.jpg');

    fireEvent.click(prevButton);
    expect(image).toHaveAttribute('src', '/test-image-2.jpg');
  });

  it('prevents image navigation clicks from triggering persona selection', () => {
    render(
      <PersonaCard
        persona={mockPersona}
        onPersonaClick={mockPersonaClickHandler}
      />
    );

    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    expect(mockPersonaClickHandler).not.toHaveBeenCalled();
  });

  it('handles book avatar button click correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(
      <PersonaCard
        persona={mockPersona}
        onPersonaClick={mockPersonaClickHandler}
      />
    );

    const bookButton = screen.getByText('Book Avatar');
    fireEvent.click(bookButton);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Book Avatar clicked for:',
      'Test Persona'
    );
    expect(mockPersonaClickHandler).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('shows expertise tags correctly with overflow handling', () => {
    render(<PersonaCard persona={mockPersona} />);

    expect(screen.getByText('Product Launches')).toBeInTheDocument();
    expect(screen.getByText('Training Videos')).toBeInTheDocument();
    expect(screen.getByText('Marketing Content')).toBeInTheDocument();
  });

  it('handles persona with many expertise tags', () => {
    const personaWithManySkills: Persona = {
      ...mockPersona,
      expertise: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5'],
    };

    render(<PersonaCard persona={personaWithManySkills} />);

    expect(screen.getByText('Skill 1')).toBeInTheDocument();
    expect(screen.getByText('Skill 2')).toBeInTheDocument();
    expect(screen.getByText('Skill 3')).toBeInTheDocument();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('handles different availability statuses', () => {
    const unavailablePersona: Persona = {
      ...mockPersona,
      availabilityStatus: 'unavailable',
    };

    render(<PersonaCard persona={unavailablePersona} />);
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });

  it('handles image load error correctly', () => {
    render(<PersonaCard persona={mockPersona} />);

    const image = screen.getByRole('img');
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/generic_secretary_stock_image.jpg');
  });

  it('displays selection indicator when selected', () => {
    render(<PersonaCard persona={mockPersona} isSelected={true} />);

    const checkIcon = screen.getByRole('img').closest('div')?.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  it('applies correct CSS classes for selection state', () => {
    const { rerender } = render(<PersonaCard persona={mockPersona} />);

    let cardContainer = screen.getByTestId('persona-card');
    expect(cardContainer).toHaveClass('hover:scale-102');

    rerender(<PersonaCard persona={mockPersona} isSelected={true} />);

    cardContainer = screen.getByTestId('persona-card');
    expect(cardContainer).toHaveClass('scale-105');
  });
});