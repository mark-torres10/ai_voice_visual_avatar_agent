# Persona Carousel Enhancement Project

## Overview
This project enhances the AI avatar generator with a professional persona selection carousel inspired by the Ponte AI marketplace design. The enhancement adds visual appeal and user engagement through interactive persona selection before content generation.

## Project Details
- **Linear Project**: [Persona Selection Carousel for AI Avatar Generator](https://linear.app/metresearch/project/persona-selection-carousel-for-ai-avatar-generator-bc916bd2aff5)
- **Team**: PonteAI
- **Status**: In Progress
- **Timeline**: Today (urgent deadline)

## Implementation Plan

### Phase 1: Foundation (PON-6)
- Extract Ponte AI color scheme
- Set up Swiper.js carousel library
- Create persona data structure
- Update Tailwind configuration

### Phase 2: Component Development (Parallel Execution)
- **PON-7**: Implement PersonaCard component with hover effects
- **PON-8**: Create carousel container with pagination
- **PON-9**: Build filter panel placeholders

### Phase 3: Integration (PON-10)
- Integrate carousel with existing form flow
- Add persona selection validation
- Update form submission logic

### Phase 4: Quality Assurance (PON-11)
- Comprehensive testing
- Visual polish and refinements
- Client approval

## Key Features
- **Persona Carousel**: Interactive carousel with pagination
- **Hover Effects**: Gradient borders and smooth animations
- **Image Navigation**: Cycle through persona images within cards
- **Selection State**: Clear visual feedback for selected personas
- **Filter Panel**: Left-side filter placeholders for future functionality
- **Form Integration**: Mandatory persona selection before script input

## Technical Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Carousel**: Swiper.js
- **Design**: Ponte AI color scheme and aesthetic
- **Data**: Local persona structure (Supabase-ready)

## Success Criteria
- [ ] Carousel displays both personas with pagination
- [ ] Hover effects work with gradient borders
- [ ] Image navigation within persona cards functions
- [ ] Persona selection is mandatory and visually clear
- [ ] Integration with existing form flow works seamlessly
- [ ] Design matches Ponte AI aesthetic
- [ ] Client approval received

## Files and Documentation
- **Specification**: `spec.md`
- **Design Reference**: https://www.ponteai.com/
- **Existing Code**: `frontend/app/page.tsx`, `frontend/components/SubmissionForm.tsx`
- **Persona Assets**: `public/voice_actor_a/`, `public/voice_actor_b/`

## Notes
- This is a frontend-only enhancement
- No backend integration required
- Focus on desktop experience
- Maintain existing functionality
- Today's deadline is critical 