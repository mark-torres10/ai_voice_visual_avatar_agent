export interface Persona {
  id: string;
  name: string;
  category: string;
  rating: number;
  bookings: number;
  priceRange: {
    min: number;
    max: number;
  };
  expertise: string[];
  images: string[];
  isAvailable: boolean;
  availabilityStatus?: 'available' | 'available_soon' | 'unavailable';
  availabilityDate?: string; // ISO date string for when persona will be available
  description?: string;
}

export const personas: Persona[] = [
  {
    id: 'persona-a',
    name: 'Sarah Chen',
    category: 'Voice Actor',
    rating: 4.8,
    bookings: 1250,
    priceRange: {
      min: 2500,
      max: 15000,
    },
    expertise: ['Product Launches', 'Training Videos'],
    images: [
      '/voice_actor_a/pic1.jpeg',
      '/voice_actor_a/pic2.jpeg',
      '/voice_actor_a/pic3.jpeg',
      '/voice_actor_a/pic4.jpeg',
      '/voice_actor_a/pic5.jpeg',
    ],
    isAvailable: true,
    availabilityStatus: 'available',
    description:
      'Professional voice actor with extensive experience in product launches and training content.',
  },
  {
    id: 'persona-b',
    name: 'Marcus Rodriguez',
    category: 'Voice Actor',
    rating: 4.9,
    bookings: 890,
    priceRange: {
      min: 3000,
      max: 20000,
    },
    expertise: ['Food Campaigns', 'Cooking Tutorials'],
    images: [
      '/voice_actor_b/pic1.jpeg',
      '/voice_actor_b/pic2.jpeg',
      '/voice_actor_b/pic3.jpeg',
      '/voice_actor_b/pic4.jpeg',
      '/voice_actor_b/pic5.jpeg',
    ],
    isAvailable: true,
    availabilityStatus: 'available',
    description:
      'Experienced voice actor specializing in food and cooking related content.',
  },
  {
    id: 'persona-c',
    name: 'Alex Thompson',
    category: 'Tech Influencer',
    rating: 4.7,
    bookings: 2100,
    priceRange: {
      min: 8000,
      max: 35000,
    },
    expertise: ['Tech Reviews', 'Product Demos', 'Startup Pitches'],
    images: ['/generic_secretary_stock_image.jpg', '/personal_picture.jpg'],
    isAvailable: false,
    availabilityStatus: 'available_soon',
    availabilityDate: '2024-02-15',
    description:
      'Tech influencer with 2M+ followers specializing in AI, startups, and product reviews.',
  },
  {
    id: 'persona-d',
    name: 'Chef Isabella Santos',
    category: 'Celebrity Chef',
    rating: 4.9,
    bookings: 1560,
    priceRange: {
      min: 12000,
      max: 45000,
    },
    expertise: ['Cooking Shows', 'Recipe Videos', 'Food Branding'],
    images: ['/generic_secretary_stock_image.jpg', '/personal_picture.jpg'],
    isAvailable: true,
    availabilityStatus: 'available',
    description:
      'Celebrity chef known for fusion cuisine and engaging cooking demonstrations.',
  },
  {
    id: 'persona-e',
    name: 'Jordan Williams',
    category: 'Professional Athlete',
    rating: 4.6,
    bookings: 780,
    priceRange: {
      min: 15000,
      max: 60000,
    },
    expertise: [
      'Sports Endorsements',
      'Motivational Content',
      'Fitness Training',
    ],
    images: ['/generic_secretary_stock_image.jpg', '/personal_picture.jpg'],
    isAvailable: false,
    availabilityStatus: 'unavailable',
    description:
      'Professional athlete with championship experience in motivational speaking and fitness content.',
  },
  {
    id: 'persona-f',
    name: 'Dr. Maya Patel',
    category: 'Podcast Host',
    rating: 4.8,
    bookings: 950,
    priceRange: {
      min: 5000,
      max: 25000,
    },
    expertise: ['Educational Content', 'Interview Hosting', 'Storytelling'],
    images: ['/generic_secretary_stock_image.jpg', '/personal_picture.jpg'],
    isAvailable: false,
    availabilityStatus: 'available_soon',
    availabilityDate: '2024-01-30',
    description:
      'Award-winning podcast host specializing in educational and interview content.',
  },
];

export const filterOptions = {
  categories: [
    'Voice Actor',
    'Tech Influencer',
    'Celebrity Chef',
    'Professional Athlete',
    'Podcast Host',
  ],
  availability: ['Available Now', 'Available Soon', 'Unavailable'],
  priceRanges: [
    { label: 'Under $5,000', min: 0, max: 4999 },
    { label: '$5,000 - $15,000', min: 5000, max: 14999 },
    { label: '$15,000 - $30,000', min: 15000, max: 29999 },
    { label: 'Over $30,000', min: 30000, max: 100000 },
  ],
};

export const getPersonaById = (id: string): Persona | undefined => {
  return personas.find((persona) => persona.id === id);
};

export const filterPersonas = (
  personas: Persona[],
  filters: {
    category?: string;
    availability?: string;
    priceRange?: { min: number; max: number };
  }
): Persona[] => {
  return personas.filter((persona) => {
    if (filters.category && persona.category !== filters.category) {
      return false;
    }

    if (filters.availability) {
      switch (filters.availability) {
        case 'Available Now':
          if (persona.availabilityStatus !== 'available') return false;
          break;
        case 'Available Soon':
          if (persona.availabilityStatus !== 'available_soon') return false;
          break;
        case 'Unavailable':
          if (persona.availabilityStatus !== 'unavailable') return false;
          break;
      }
    }

    if (filters.priceRange) {
      const personaMin = persona.priceRange.min;
      const personaMax = persona.priceRange.max;
      const filterMin = filters.priceRange.min;
      const filterMax = filters.priceRange.max;

      if (personaMin > filterMax || personaMax < filterMin) {
        return false;
      }
    }

    return true;
  });
};
