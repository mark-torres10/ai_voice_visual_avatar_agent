# Frontend Agent Rules

## 🎯 Scope & Responsibilities

**Directory Control**: `frontend/` only
**Primary Goal**: Create an elegant, responsive chat interface for AI avatar generation

## 🏗️ Technical Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS v3 (user preference)
- **TypeScript**: Strict mode enabled
- **State Management**: React useState/useContext for simple state
- **HTTP Client**: Built-in fetch API
- **Deployment**: Vercel-ready configuration

## 🎨 UI/UX Requirements

### Design Philosophy
- **Minimalist**: Clean, uncluttered interface focusing on the avatar interaction
- **Responsive**: Mobile-first design with seamless desktop scaling
- **Accessible**: WCAG 2.1 AA compliance
- **Performance**: Sub-3s initial load, smooth 60fps animations

### Visual Guidelines
- **Color Palette**: 
  - Primary: Gradient-based (blue to purple)
  - Neutral: Gray-50 to Gray-900 scale
  - Accent: Emerald for success states
- **Typography**: Inter font family, clear hierarchy
- **Spacing**: 8px grid system via Tailwind
- **Shadows**: Subtle depth with soft shadows

## 📋 Component Architecture

### Required Components

```typescript
// Core Layout
- Layout: Main app wrapper with navigation
- ChatInterface: Primary interaction component
- VideoPlayer: Avatar video display with controls
- InputArea: Text input with send button
- LoadingStates: Elegant loading animations

// UI Components  
- Button: Consistent button styling with variants
- Typography: Heading, body, caption components
- Card: Container component for content blocks
- Spinner: Loading indicator component
```

### Component Guidelines
- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Prefer composition over inheritance
- **Props Interface**: TypeScript interfaces for all props
- **Error Boundaries**: Wrap async components
- **Memoization**: Use React.memo for expensive renders

## 🔌 API Integration

### Backend Communication

```typescript
// Required API Functions
interface ApiService {
  generateVideo(userMessage: string): Promise<VideoResponse>
  checkVideoStatus(taskId: string): Promise<StatusResponse>
}

// Response Types
interface VideoResponse {
  taskId: string
  videoUrl?: string
  status: 'processing' | 'completed' | 'failed'
  script?: string
  estimatedTime?: number
}
```

### Error Handling
- **Network Errors**: Graceful degradation with retry logic
- **Timeout Handling**: 30s timeout with user feedback
- **Rate Limiting**: Respect API limits with user notifications
- **Offline Support**: Basic offline state detection

## 📱 User Experience Flow

### Primary Interaction Pattern
1. **Input State**: User types message in text area
2. **Loading State**: Show progress indicator with estimated time
3. **Processing State**: Display script preview while video generates
4. **Success State**: Autoplay video with playback controls
5. **Error State**: Clear error message with retry option

### Micro-interactions
- **Button States**: Hover, active, disabled with smooth transitions
- **Input Focus**: Subtle glow effect on text area focus
- **Video Loading**: Skeleton placeholder during load
- **Typing Indicators**: Show when processing script

## 🛡️ Input Validation & Security

### Client-Side Validation
```typescript
interface MessageValidation {
  minLength: 1
  maxLength: 500
  allowedChars: /^[a-zA-Z0-9\s\.,!?'"()-]+$/
  rateLimitPerMinute: 5
}
```

### Security Measures
- **XSS Prevention**: Sanitize all user inputs
- **CSRF Protection**: Include CSRF tokens
- **Content Filtering**: Block inappropriate content
- **Rate Limiting**: Client-side request throttling

## ⚡ Performance Requirements

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Strategies
- **Code Splitting**: Route-based and component-based
- **Image Optimization**: Next.js Image component with WebP
- **Lazy Loading**: Video and non-critical components
- **Caching**: Implement SWR for API responses

## 🧪 Testing Requirements

### Test Coverage Targets
- **Unit Tests**: 80%+ coverage using Jest + React Testing Library
- **Integration Tests**: Critical user flows
- **E2E Tests**: Full video generation workflow using Playwright

### Test Categories
```typescript
// Component Tests
- Input validation behavior
- Loading state transitions  
- Error state handling
- Video playback controls

// Integration Tests
- API error scenarios
- Network failure recovery
- Video generation workflow
```

## 📂 File Structure

```
frontend/
├── app/
│   ├── page.tsx                 # Main chat interface
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── ChatInterface.tsx       # Main chat component
│   ├── VideoPlayer.tsx         # Video display component
│   └── InputArea.tsx           # Message input component
├── lib/
│   ├── api.ts                  # API service functions
│   ├── types.ts                # TypeScript definitions
│   └── utils.ts                # Utility functions
├── hooks/
│   └── useVideoGeneration.ts   # Custom hook for video logic
└── __tests__/                  # Test files
```

## ✅ Success Criteria

### Functional Requirements ✓
- [ ] Text input accepts 1-500 character messages
- [ ] "Generate" button triggers video creation
- [ ] Video displays with standard HTML5 controls
- [ ] Loading states provide clear user feedback
- [ ] Error states allow for easy retry

### Technical Requirements ✓
- [ ] TypeScript strict mode with no `any` types
- [ ] Responsive design works on mobile and desktop
- [ ] Accessibility score of 95+ on Lighthouse
- [ ] Performance score of 90+ on Lighthouse
- [ ] All tests pass with 80%+ coverage

### UX Requirements ✓
- [ ] Initial load completes in under 3 seconds
- [ ] Video generation feedback within 2 seconds
- [ ] Smooth animations at 60fps
- [ ] Intuitive interface requiring no instructions
- [ ] Graceful error handling with helpful messages

## 🚫 Boundaries & Constraints

### What This Agent SHOULD Do
- Build and style all frontend components
- Implement client-side validation
- Create responsive, accessible UI
- Handle all frontend state management
- Write comprehensive frontend tests

### What This Agent SHOULD NOT Do
- Modify backend API endpoints
- Handle server-side authentication
- Implement video processing logic
- Manage external API integrations
- Configure deployment infrastructure

## 🔗 Integration Points

### Backend Dependencies
```typescript
// Expected Backend Endpoints
POST /api/generate
- Input: { userMessage: string }
- Output: VideoResponse

GET /api/status/:taskId  
- Output: StatusResponse
```

### Environment Variables
```typescript
// Required Frontend Config
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development
``` 