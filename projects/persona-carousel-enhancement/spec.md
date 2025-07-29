# 🧾 Spec: AI Avatar Persona Carousel Enhancement

## 1. Problem Statement
The current AI avatar generator has a basic form interface that lacks visual appeal and user engagement. Users need a way to select personas before generating content, but the current flow is too simplistic and doesn't match the professional quality expected by clients. The client has provided design inspiration from Ponte AI marketplace that needs to be implemented to enhance the user experience and visual appeal.

**Why now**: Client requirements and today's deadline for UI enhancement.
**Strategic link**: Improving product competitiveness and user experience to match industry standards.

## 2. Desired Outcomes & Metrics
**Functional Success**: 
- Carousel works smoothly with hover effects and image navigation
- Users can select personas with clear visual feedback
- Seamless integration with existing form flow

**Visual Success**: 
- Matches Ponte AI design aesthetic and color scheme
- Professional appearance that meets client expectations

**User Experience**: 
- Clear persona selection flow (select persona → enter script → generate)
- Responsive hover effects and visual feedback

## 3. In Scope / Out of Scope
**In Scope**:
- Frontend carousel component with pagination
- Hover effects with gradient borders
- Image navigation within each persona card
- Persona selection with visual feedback (enlargement, gradient, selection indicator)
- Left-side filter panel (visual placeholder only)
- Data structure for personas (local implementation, Supabase-ready)
- Integration with existing form flow
- Ponte AI color scheme implementation

**Out of Scope**:
- Backend integration or persona influence on generation
- Actual filter functionality
- Mobile responsiveness
- Analytics tracking
- Additional personas beyond current two
- Edge case handling for slow loading or errors

## 4. Stakeholders & Dependencies
**Stakeholders**:
- Client (design preferences and approval)
- End users (persona selection experience)
- Development team (implementation)

**Dependencies**:
- Existing persona image assets in `/public/voice_actor_a/` and `/public/voice_actor_b/`
- Ponte AI design reference for color scheme
- Current Next.js/TypeScript/Tailwind stack

## 5. Risks / Unknowns
**Technical Risks**:
- Carousel library integration complexity
- Image loading performance with multiple persona images
- Color scheme extraction accuracy from Ponte AI

**Timeline Risks**:
- Today's deadline pressure
- Client feedback timing

**Known Unknowns**:
- Specific carousel library selection (will evaluate Swiper.js)
- Exact gradient styling preferences

## 6. UX Notes & Accessibility
**User Journey Changes**:
- Current: Form → Generate
- New: Persona Selection (required) → Form → Generate

**Key UX Requirements**:
- Persona selection is mandatory before form submission
- Clear visual feedback for selected persona (enlargement, gradient, selection indicator)
- Hover effects for interactive feedback
- Pagination for carousel navigation

**Design System Impact**:
- New PersonaCard component
- Updated color scheme to match Ponte AI
- Filter panel component structure

## 7. Technical Notes
**Implementation Approach**:
- Use off-the-shelf carousel library (Swiper.js recommended)
- Create PersonaCard component with hover effects
- Implement local data structure for personas (Supabase-ready)
- Extract and implement Ponte AI color scheme
- Pagination for carousel navigation

**Architecture**:
- Component-based structure for reusability
- Local data structure for quick iteration
- Responsive design for desktop web application

**Extensibility**:
- Data structure designed for future Supabase integration
- Component architecture supports additional personas
- Filter panel structure ready for future functionality

## 8. Compliance, Cost, GTM
**Compliance**: None required for frontend-only changes
**Cost**: No additional infrastructure costs
**GTM**: Client approval required for design implementation

## 9. Success Criteria
**Functional Criteria**:
- [ ] Carousel displays both personas with pagination
- [ ] Hover effects work with gradient borders
- [ ] Image navigation within persona cards functions
- [ ] Persona selection is mandatory and visually clear
- [ ] Integration with existing form flow works seamlessly

**Visual Criteria**:
- [ ] Design matches Ponte AI aesthetic
- [ ] Color scheme implemented correctly
- [ ] Professional appearance meets client expectations

**Technical Criteria**:
- [ ] Responsive design for desktop
- [ ] Local data structure implemented
- [ ] Component architecture supports future expansion

**Definition of Done**: All success criteria met, client approval received, and feature deployed to production. 