# Audio Agent Rules

## 🎯 Scope & Responsibilities

**Directory Control**: `backend/generateScriptAndAudio.js` and related audio processing files
**Primary Goal**: Transform user messages into natural conversation scripts and high-quality speech audio

## 🏗️ Technical Stack

- **Runtime**: Node.js 18+ with ES6 modules
- **HTTP Framework**: Express.js or Next.js API routes
- **AI Integration**: OpenAI GPT-4o-mini API
- **TTS Service**: ElevenLabs Voice API
- **Audio Processing**: Built-in Buffer handling, optional: fluent-ffmpeg
- **Environment**: dotenv for secure API key management
- **Validation**: Joi or Zod for input validation

## 🤖 AI Script Generation

### GPT-4o Integration Standards

```javascript
// Required Configuration
const GPT_CONFIG = {
  model: 'gpt-4o-mini',
  maxTokens: 150,
  temperature: 0.7,
  presencePenalty: 0.1,
  frequencyPenalty: 0.1
}

// System Prompt Template
const SYSTEM_PROMPT = `You are a friendly, conversational AI avatar. 
Generate natural, engaging responses that sound authentic when spoken aloud.
- Keep responses 1-3 sentences
- Use conversational tone with natural pauses
- Avoid complex technical jargon
- Include subtle emotional expressions
- Length: 20-100 words maximum`
```

### Script Quality Standards
- **Conversational Tone**: Natural speech patterns, contractions
- **Optimal Length**: 20-100 words (8-15 seconds when spoken)
- **Pronunciation**: Avoid complex technical terms or unusual words
- **Emotional Range**: Include appropriate emotional context
- **Cultural Sensitivity**: Neutral, inclusive language

### Error Handling for GPT-4o
```javascript
// Robust Error Handling Pattern
async function generateScript(userMessage) {
  try {
    const response = await openai.chat.completions.create({...});
    return validateScriptQuality(response.choices[0].message.content);
  } catch (error) {
    if (error.code === 'rate_limit_exceeded') {
      throw new RateLimitError('GPT-4o rate limit exceeded');
    }
    if (error.code === 'insufficient_quota') {
      throw new QuotaError('GPT-4o quota exhausted');
    }
    throw new ScriptGenerationError('Failed to generate script');
  }
}
```

## 🎙️ ElevenLabs TTS Integration

### Voice Configuration

```javascript
// Recommended Voice Settings
const VOICE_CONFIG = {
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // Default: Bella (warm, friendly)
  modelId: 'eleven_multilingual_v2',
  voiceSettings: {
    stability: 0.5,        // Consistent but not robotic
    similarityBoost: 0.8,  // Close to original voice
    style: 0.2,           // Slight style variation
    useSpeakerBoost: true
  }
}
```

### Audio Quality Standards
- **Sample Rate**: 44.1kHz minimum
- **Bit Depth**: 16-bit minimum  
- **Format**: MP3 for web delivery (fallback: WAV)
- **Bitrate**: 128kbps minimum for speech clarity
- **Duration**: Target 8-15 seconds for optimal UX

### ElevenLabs Error Handling
```javascript
// Comprehensive Error Management
async function generateAudio(script) {
  try {
    const response = await elevenlabs.textToSpeech({...});
    return await processAudioBuffer(response.data);
  } catch (error) {
    if (error.status === 429) {
      throw new RateLimitError('ElevenLabs rate limit exceeded');
    }
    if (error.status === 401) {
      throw new AuthError('Invalid ElevenLabs API key');
    }
    if (error.status === 400) {
      throw new ValidationError('Invalid script for TTS conversion');
    }
    throw new AudioGenerationError('TTS conversion failed');
  }
}
```

## 📊 API Endpoint Specification

### Primary Endpoint: POST `/api/generate/audio`

```typescript
// Request Schema
interface AudioGenerationRequest {
  userMessage: string     // 1-500 characters
  voiceId?: string       // Optional voice override
  language?: string      // Default: 'en' 
  priority?: 'standard' | 'high'
}

// Response Schema  
interface AudioGenerationResponse {
  success: boolean
  data: {
    script: string
    audioUrl: string
    audioBase64?: string    // Fallback option
    duration: number        // Audio length in seconds
    voiceId: string
    generationTime: number  // Processing time in ms
  }
  metadata: {
    scriptTokens: number
    audioBytes: number
    cacheHit: boolean
  }
}

// Error Response Schema
interface ErrorResponse {
  success: false
  error: {
    code: string           // 'RATE_LIMIT', 'QUOTA_EXCEEDED', etc.
    message: string
    retryAfter?: number    // Seconds until retry allowed
    requestId: string
  }
}
```

### Input Validation Rules

```javascript
const VALIDATION_SCHEMA = {
  userMessage: {
    type: 'string',
    minLength: 1,
    maxLength: 500,
    pattern: /^[a-zA-Z0-9\s\.,!?'"()\-:;]+$/,
    sanitization: 'html-entities-encode'
  },
  voiceId: {
    type: 'string',
    optional: true,
    pattern: /^[a-zA-Z0-9]{20}$/
  },
  language: {
    type: 'string',
    optional: true,
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt'],
    default: 'en'
  }
}
```

## ⚡ Performance & Optimization

### Caching Strategy
```javascript
// Multi-Level Caching
const CACHE_LAYERS = {
  // Level 1: In-memory for frequent scripts
  memory: new LRU({ max: 100, ttl: 1000 * 60 * 15 }), // 15 min
  
  // Level 2: Redis for shared scripts  
  redis: { ttl: 1000 * 60 * 60 * 24 }, // 24 hours
  
  // Level 3: File system for audio files
  filesystem: { ttl: 1000 * 60 * 60 * 24 * 7 } // 7 days
}

// Cache Key Strategy
function generateCacheKey(userMessage, voiceId) {
  return `audio:${hash(userMessage)}:${voiceId}`;
}
```

### Rate Limiting & Quotas
```javascript
// Service Limits Configuration
const RATE_LIMITS = {
  gpt4o: {
    requestsPerMinute: 50,
    tokensPerMinute: 30000,
    requestsPerDay: 1000
  },
  elevenlabs: {
    requestsPerMinute: 20,
    charactersPerMonth: 100000,
    requestsPerDay: 500
  },
  api: {
    requestsPerUser: 5,    // Per minute
    concurrentRequests: 3
  }
}
```

### Processing Optimization
- **Parallel Processing**: Run GPT-4o and prepare TTS config simultaneously when possible
- **Streaming**: Stream audio directly to client without full buffer
- **Compression**: Optimize audio files for web delivery
- **CDN Integration**: Store generated audio in CDN for global delivery

## 🛡️ Security & Privacy

### API Key Management
```javascript
// Secure Environment Configuration
const CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID
  },
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY,
    baseUrl: 'https://api.elevenlabs.io/v1'
  }
}

// Key Validation on Startup
function validateApiKeys() {
  if (!CONFIG.openai.apiKey?.startsWith('sk-')) {
    throw new Error('Invalid OpenAI API key format');
  }
  if (!CONFIG.elevenlabs.apiKey?.length === 32) {
    throw new Error('Invalid ElevenLabs API key format');
  }
}
```

### Data Privacy Standards
- **User Data**: Never log or store user messages permanently
- **Generated Content**: Cache only hashed versions of scripts
- **Audio Files**: Auto-delete after 24 hours
- **API Logs**: Strip sensitive data from error logs
- **GDPR Compliance**: Provide data deletion endpoints

## 🧪 Testing Strategy

### Unit Test Coverage
```javascript
// Required Test Categories
describe('Audio Agent', () => {
  describe('Script Generation', () => {
    test('generates conversational script from user message');
    test('handles rate limit errors gracefully');
    test('validates script quality and length');
    test('sanitizes inappropriate content');
  });

  describe('TTS Integration', () => {
    test('converts script to high-quality audio');
    test('handles ElevenLabs API errors');
    test('validates audio output format');
    test('respects voice configuration settings');
  });

  describe('API Endpoint', () => {
    test('validates input parameters');
    test('returns proper response format');
    test('handles concurrent requests');
    test('implements rate limiting');
  });
});
```

### Integration Testing
- **End-to-End Flow**: User message → Script → Audio → Response
- **External API Mocking**: Mock GPT-4o and ElevenLabs for CI/CD
- **Error Scenario Testing**: Network failures, API outages, quota limits
- **Performance Testing**: Response time under various loads

### Monitoring & Observability
```javascript
// Required Metrics
const METRICS = {
  scriptGeneration: {
    successRate: 'counter',
    responseTime: 'histogram',
    tokenUsage: 'gauge'
  },
  audioGeneration: {
    successRate: 'counter', 
    responseTime: 'histogram',
    audioQuality: 'gauge'
  },
  api: {
    requestRate: 'counter',
    errorRate: 'counter',
    cacheHitRate: 'gauge'
  }
}
```

## 📁 File Structure

```
backend/
├── audio/
│   ├── generateScriptAndAudio.js    # Main entry point
│   ├── services/
│   │   ├── gpt4oService.js         # OpenAI integration
│   │   ├── elevenlabsService.js    # TTS integration
│   │   └── cacheService.js         # Caching layer
│   ├── middleware/
│   │   ├── validation.js           # Input validation
│   │   ├── rateLimiting.js         # Rate limit enforcement
│   │   └── errorHandling.js        # Error management
│   ├── utils/
│   │   ├── audioProcessor.js       # Audio format handling
│   │   ├── scriptValidator.js      # Script quality checks
│   │   └── monitoring.js           # Metrics collection
│   └── __tests__/
│       ├── integration/
│       └── unit/
```

## ✅ Success Criteria

### Functional Requirements ✓
- [ ] Generates natural conversational scripts (8-15 seconds when spoken)
- [ ] Converts scripts to high-quality MP3 audio
- [ ] Returns audio within 5 seconds for standard requests
- [ ] Handles 95%+ of requests successfully under normal load
- [ ] Implements proper error handling for all failure modes

### Technical Requirements ✓
- [ ] OpenAI API integration with proper error handling
- [ ] ElevenLabs integration with voice optimization
- [ ] Multi-level caching for performance
- [ ] Rate limiting and quota management
- [ ] Comprehensive input validation and sanitization

### Quality Requirements ✓
- [ ] Audio clarity suitable for avatar lip-sync
- [ ] Script quality appropriate for conversational AI
- [ ] Response time under 5 seconds 95th percentile
- [ ] Error rate below 1% under normal conditions
- [ ] Test coverage above 85% for critical paths

## 🚫 Boundaries & Constraints

### What This Agent SHOULD Do
- Generate conversational scripts using GPT-4o
- Convert scripts to speech using ElevenLabs
- Implement caching and rate limiting
- Handle all audio processing logic
- Provide monitoring and error handling

### What This Agent SHOULD NOT Do
- Process or generate video content
- Handle frontend user interface logic
- Manage user authentication or sessions
- Implement business logic outside audio generation
- Directly serve static files or handle file uploads

## 🔗 Integration Points

### Frontend Dependencies
```javascript
// Expected Frontend Integration
fetch('/api/generate/audio', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userMessage: 'Hello!' })
})
.then(response => response.json())
.then(data => {
  // Frontend receives: { script, audioUrl, duration }
});
```

### Video Agent Handoff
```javascript
// Data Format for Video Agent
interface AudioOutput {
  script: string      // For D-ID lip-sync
  audioUrl: string    // Public URL to audio file
  duration: number    // For video timing
  voiceId: string     // For consistency tracking
}
``` 