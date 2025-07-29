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
  description?: string;
}

export const personas: Persona[] = [
  {
    id: 'persona-a',
    name: 'Person A',
    category: 'Voice Actor',
    rating: 4.8,
    bookings: 1250,
    priceRange: {
      min: 2500,
      max: 15000
    },
    expertise: ['Product Launches', 'Training Videos'],
    images: [
      '/voice_actor_a/pic1.jpeg',
      '/voice_actor_a/pic2.jpeg',
      '/voice_actor_a/pic3.jpeg',
      '/voice_actor_a/pic4.jpeg',
      '/voice_actor_a/pic5.jpeg'
    ],
    isAvailable: true,
    description: 'Professional voice actor with extensive experience in product launches and training content.'
  },
  {
    id: 'persona-b',
    name: 'Person B',
    category: 'Voice Actor',
    rating: 4.9,
    bookings: 890,
    priceRange: {
      min: 3000,
      max: 20000
    },
    expertise: ['Food Campaigns', 'Cooking Tutorials'],
    images: [
      '/voice_actor_b/pic1.jpeg',
      '/voice_actor_b/pic2.jpeg',
      '/voice_actor_b/pic3.jpeg',
      '/voice_actor_b/pic4.jpeg',
      '/voice_actor_b/pic5.jpeg'
    ],
    isAvailable: true,
    description: 'Experienced voice actor specializing in food and cooking related content.'
  }
];

export const filterOptions = {
  categories: ['Voice Actor', 'Tech Influencer', 'Celebrity Chef', 'Professional Athlete', 'Podcast Host'],
  availability: ['Available Now', 'Available Soon', 'Unavailable'],
  priceRanges: [
    { label: 'Under $5,000', min: 0, max: 5000 },
    { label: '$5,000 - $15,000', min: 5000, max: 15000 },
    { label: '$15,000 - $30,000', min: 15000, max: 30000 },
    { label: 'Over $30,000', min: 30000, max: 100000 }
  ]
};

export const getPersonaById = (id: string): Persona | undefined => {
  return personas.find(persona => persona.id === id);
};

export const filterPersonas = (
  personas: Persona[],
  filters: {
    category?: string;
    availability?: string;
    priceRange?: { min: number; max: number };
  }
): Persona[] => {
  return personas.filter(persona => {
    if (filters.category && persona.category !== filters.category) {
      return false;
    }
    
    if (filters.availability) {
      const isAvailable = filters.availability === 'Available Now' ? persona.isAvailable : true;
      if (!isAvailable) return false;
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