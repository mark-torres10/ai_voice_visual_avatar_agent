# PersonaCard Component

## Overview

The `PersonaCard` component is a reusable React component that displays individual AI personas with interactive features including hover effects, image navigation, and selection states. It's part of the PonteAI persona carousel enhancement project (PON-7).

## Features

### ✨ Core Features
- **Persona Information Display**: Shows name, category, rating, bookings, price range, and expertise tags
- **Image Gallery**: Displays persona images with navigation controls
- **Interactive Hover Effects**: Gradient border animations using Ponte AI colors
- **Selection State**: Visual feedback with scaling and gradient indicators
- **Play Button Overlay**: Appears on image hover for enhanced interactivity
- **Book Avatar Button**: Placeholder for future booking functionality

### 🎨 Visual Design
- **Ponte AI Color Scheme**: Consistent use of brand colors throughout
- **Gradient Borders**: Dynamic gradient borders on hover and selection
- **Smooth Animations**: CSS transitions for all interactive elements
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### 🖼️ Image Navigation
- **Multiple Image Support**: Cycles through persona image arrays
- **Navigation Controls**: Previous/next buttons on hover
- **Image Indicators**: Dot indicators showing current image position
- **Error Handling**: Fallback to default image on load errors

## Usage

### Basic Usage
```tsx
import PersonaCard from '@/components/PersonaCard';
import { personas } from '@/lib/personas';

<PersonaCard 
  persona={personas[0]} 
  onPersonaClick={(persona) => console.log('Selected:', persona)}
/>
```

### With Selection State
```tsx
<PersonaCard 
  persona={persona}
  isSelected={selectedPersonaId === persona.id}
  onPersonaClick={handlePersonaSelection}
  className="custom-styles"
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `persona` | `Persona` | ✅ | - | The persona object to display |
| `isSelected` | `boolean` | ❌ | `false` | Whether the card is currently selected |
| `onPersonaClick` | `(persona: Persona) => void` | ❌ | - | Callback fired when the card is clicked |
| `className` | `string` | ❌ | `''` | Additional CSS classes |

## Persona Data Structure

```typescript
interface Persona {
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
  availabilityStatus: 'available' | 'available_soon' | 'unavailable';
  availabilityDate?: string;
  description?: string;
}
```

## Styling

### CSS Classes
The component uses Tailwind CSS with the Ponte AI color scheme:

- **Primary Colors**: `ponte-accent`, `ponte-yellow`, `ponte-text`
- **Background Colors**: `ponte-secondary`, `ponte-backgroundLight`
- **Border Colors**: `ponte-border`, `ponte-borderLight`

### Custom Animations
- **Hover Scale**: `hover:scale-102` for subtle hover effect
- **Selection Scale**: `scale-105` for selected state
- **Gradient Borders**: Dynamic gradient backgrounds on hover/selection

## Event Handling

### Click Events
- **Card Click**: Triggers `onPersonaClick` with the persona object
- **Image Navigation**: Prevents event bubbling to card click
- **Book Button**: Separate handler (currently placeholder)

### Hover States
- **Mouse Enter/Leave**: Manages hover state for gradient borders
- **Image Hover**: Shows play button overlay and navigation controls

## Accessibility

### ARIA Support
- **Image Alt Text**: Descriptive alt text for persona images
- **Button Labels**: Clear aria-labels for navigation buttons
- **Role Attributes**: Proper semantic HTML structure

### Keyboard Navigation
- **Tab Order**: Logical tab sequence through interactive elements
- **Focus Indicators**: Visible focus states for keyboard users

## Testing

The component includes comprehensive unit tests covering:

- ✅ **Rendering**: All persona information displays correctly
- ✅ **Interactions**: Click handlers and event propagation
- ✅ **Navigation**: Image cycling functionality
- ✅ **States**: Selection and hover state management
- ✅ **Error Handling**: Image load error scenarios
- ✅ **Accessibility**: ARIA attributes and keyboard support

### Running Tests
```bash
npm test PersonaCard
```

## Integration

### PersonaCarousel Integration
The component is designed to work seamlessly with the `PersonaCarousel` component:

```tsx
{personas.map((persona) => (
  <PersonaCard
    key={persona.id}
    persona={persona}
    isSelected={selectedPersonaId === persona.id}
    onPersonaClick={handlePersonaClick}
  />
))}
```

### Form Integration
Can be integrated with form validation for mandatory persona selection:

```tsx
const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
const [validationError, setValidationError] = useState('');

const handleSubmit = () => {
  if (!selectedPersona) {
    setValidationError('Please select a persona');
    return;
  }
  // Continue with form submission
};
```

## Browser Support

- ✅ **Chrome**: 88+
- ✅ **Firefox**: 78+
- ✅ **Safari**: 14+
- ✅ **Edge**: 88+

## Performance

### Optimizations
- **Image Loading**: Efficient image handling with error fallbacks
- **Event Delegation**: Proper event handling to prevent memory leaks
- **CSS Transitions**: Hardware-accelerated animations
- **Bundle Size**: Minimal dependencies for optimal loading

### Recommendations
- Use `next/image` for production builds (currently using `<img>` for compatibility)
- Implement image lazy loading for large persona lists
- Consider virtualization for extensive persona catalogs

## Contributing

When making changes to the PersonaCard component:

1. **Update Tests**: Ensure all test cases pass
2. **Check Accessibility**: Test with screen readers and keyboard navigation
3. **Verify Design**: Confirm Ponte AI color scheme consistency
4. **Test Integration**: Validate with PersonaCarousel component
5. **Document Changes**: Update this README if adding new features

## Implementation Notes

### Design Decisions
- **Gradient Borders**: Implemented using CSS gradients for smooth animations
- **Image Navigation**: Hidden by default, shown on hover for clean design
- **Selection Indicator**: Checkmark icon for clear visual confirmation
- **Expertise Tags**: Limited to 3 visible tags with "+X more" overflow

### Technical Considerations
- **State Management**: Local state for image navigation and hover effects
- **Event Handling**: Careful event propagation control for nested interactions
- **CSS Classes**: Dynamic class generation based on component state
- **Type Safety**: Full TypeScript support with proper interface definitions

---

**PON-7 Implementation**: This component fulfills all requirements for the PersonaCard component with hover effects as specified in the Linear ticket PON-7.