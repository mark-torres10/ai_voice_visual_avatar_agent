# Ponte AI Color Scheme

This document contains the color scheme extracted from the Ponte AI marketplace website (https://www.ponteai.com/) for use in the persona carousel implementation.

## Primary Colors

### Background Colors

- **Background**: `#09090b` (rgb(9, 9, 11)) - Very dark gray/black
- **Background Light**: `rgba(9, 9, 11, 0.6)` - Semi-transparent background
- **Background Lighter**: `rgba(9, 9, 11, 0.4)` - More transparent background

### Text Colors

- **Text**: `#fafafa` (rgb(250, 250, 250)) - Off-white
- **Text Muted**: `rgba(250, 250, 250, 0.8)` - Slightly transparent text
- **Text Light**: `rgba(250, 250, 250, 0.6)` - More transparent text

### Accent Colors

- **Accent**: `#dd3c61` (rgb(221, 60, 97)) - Bright pink
- **Accent Light**: `rgba(221, 60, 97, 0.2)` - Light pink overlay
- **Accent Dark**: `rgba(221, 60, 97, 0.9)` - Dark pink overlay

### Secondary Colors

- **Secondary**: `#27272a` (rgb(39, 39, 42)) - Medium gray
- **Light Gray**: `#a1a1aa` (rgb(161, 161, 170)) - Light gray
- **Yellow**: `#facc15` (rgb(250, 204, 21)) - Golden yellow

### Border Colors

- **Border**: `rgba(255, 255, 255, 0.1)` - Subtle white border
- **Border Light**: `rgba(255, 255, 255, 0.2)` - More visible white border

## Usage in Tailwind CSS

The colors are available in the Tailwind config under the `ponte` namespace:

```css
.bg-ponte-background    /* Main background */
.text-ponte-text        /* Main text color */
.bg-ponte-accent        /* Pink accent */
.border-ponte-border    /* Subtle borders */
```

## Design Patterns

### Card Design

- Dark background with subtle transparency
- White text for contrast
- Pink accents for interactive elements
- Subtle borders for definition

### Interactive Elements

- Pink accent color for buttons and highlights
- Hover effects with gradient borders
- Smooth transitions and animations

### Typography

- Off-white text for readability
- Muted text for secondary information
- Clear hierarchy with size and weight variations
