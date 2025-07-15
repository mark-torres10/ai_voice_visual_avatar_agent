# Video Agent Rules

## 🎯 Scope & Responsibilities

**Directory Control**: `backend/generateVideo.js` and related video processing files
**Primary Goal**: Transform scripts and audio into high-quality talking avatar videos using D-ID API

## 🏗️ Technical Stack

- **Runtime**: Node.js 18+ with ES6 modules
- **HTTP Framework**: Express.js or Next.js API routes
- **Video API**: D-ID Creative Reality Studio API
- **Video Processing**: ffmpeg (via fluent-ffmpeg)
- **File Storage**: AWS S3 or equivalent for video assets
- **Streaming**: HLS or progressive download support
- **Environment**: dotenv for secure API key management
- **Validation**: Joi or Zod for input validation

## 🎬 D-ID Integration Standards

### API Configuration

```javascript
// Required D-ID Configuration
const DID_CONFIG = {
  baseUrl: 'https://api.d-id.com',
  apiVersion: 'v1',
  timeout: 120000,  // 2 minutes for video generation
  retryAttempts: 3,
  retryDelay: 5000
}

// Presenter Configuration
const PRESENTER_CONFIG = {
  // Default avatar - professional, friendly appearance
  sourceUrl: 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
  
  // Alternative presenters for variety
  alternatives: [
    'https://d-id-public-bucket.s3.amazonaws.com/amy.jpg',    // Professional female
    'https://d-id-public-bucket.s3.amazonaws.com/noah.jpg',   // Professional male
    'https://d-id-public-bucket.s3.amazonaws.com/emma.jpg'    // Casual friendly
  ],
  
  // Video quality settings
  quality: 'high',
  resolution: '512x512',  // Optimized for web
  format: 'mp4'
}
```

### Video Generation Pipeline

```javascript
// Complete Video Generation Flow
async function generateVideo(audioData, script) {
  try {
    // Step 1: Upload audio to D-ID
    const audioUpload = await uploadAudioToDidStorage(audioData.audioUrl);
    
    // Step 2: Create talk request
    const talkRequest = await createTalkRequest({
      source_url: PRESENTER_CONFIG.sourceUrl,
      script: {
        type: 'audio',
        audio_url: audioUpload.url,
        reduce_noise: true,
        ssml: false
      },
      config: {
        result_format: 'mp4',
        fluent: true,
        pad_audio: 0.0,
        stitch: true
      }
    });
    
    // Step 3: Poll for completion
    const completedVideo = await pollVideoStatus(talkRequest.id);
    
    // Step 4: Process and optimize
    return await processCompletedVideo(completedVideo);
    
  } catch (error) {
    throw new VideoGenerationError('Video generation failed', error);
  }
}
```

### Error Handling for D-ID API

```javascript
// Comprehensive Error Management
async function handleDidApiError(error, context) {
  const errorMap = {
    400: () => new ValidationError('Invalid video generation parameters'),
    401: () => new AuthError('Invalid D-ID API credentials'),
    402: () => new QuotaError('D-ID quota exceeded or payment required'),
    429: () => new RateLimitError('D-ID rate limit exceeded'),
    500: () => new ServiceError('D-ID service temporarily unavailable'),
    503: () => new ServiceError('D-ID service overloaded')
  };
  
  const mappedError = errorMap[error.status];
  if (mappedError) {
    throw mappedError();
  }
  
  // Log unexpected errors for investigation
  console.error('Unexpected D-ID API error:', {
    status: error.status,
    message: error.message,
    context,
    timestamp: new Date().toISOString()
  });
  
  throw new VideoGenerationError('Unexpected video generation error');
}
```

## 🎥 Video Processing & Optimization

### Quality Standards

```javascript
// Video Output Specifications
const VIDEO_SPECS = {
  resolution: {
    width: 512,
    height: 512
  },
  frameRate: 25,           // Optimal for talking heads
  bitrate: '1000k',        // Balance quality vs file size
  format: 'mp4',
  codec: {
    video: 'h264',         // Web-compatible
    audio: 'aac'           // Web-compatible
  },
  maxDuration: 30,         // Seconds
  maxFileSize: 10 * 1024 * 1024  // 10MB limit
}
```

### Post-Processing Pipeline

```javascript
// Video Enhancement and Optimization
async function processCompletedVideo(rawVideoUrl) {
  try {
    // Download video from D-ID
    const videoBuffer = await downloadVideo(rawVideoUrl);
    
    // Apply post-processing
    const processedVideo = await ffmpeg(videoBuffer)
      .videoCodec('libx264')
      .audioCodec('aac')
      .size('512x512')
      .fps(25)
      .videoBitrate('1000k')
      .audioBitrate('128k')
      .format('mp4')
      .on('start', (cmd) => console.log('Processing:', cmd))
      .on('progress', (progress) => updateProcessingStatus(progress))
      .toBuffer();
    
    // Upload to CDN/storage
    const cdnUrl = await uploadToStorage(processedVideo);
    
    // Generate thumbnail
    const thumbnail = await generateThumbnail(processedVideo);
    const thumbnailUrl = await uploadToStorage(thumbnail, 'thumbnail');
    
    return {
      videoUrl: cdnUrl,
      thumbnailUrl,
      duration: await getVideoDuration(processedVideo),
      fileSize: processedVideo.length,
      format: 'mp4',
      resolution: VIDEO_SPECS.resolution
    };
    
  } catch (error) {
    throw new VideoProcessingError('Post-processing failed', error);
  }
}
```

## 📊 API Endpoint Specification

### Primary Endpoint: POST `/api/generate/video`

```typescript
// Request Schema
interface VideoGenerationRequest {
  script: string          // Text script for lip-sync
  audioUrl: string        // URL to audio file
  presenterId?: string    // Optional presenter override
  priority?: 'standard' | 'high'
  webhookUrl?: string     // For async completion notification
}

// Response Schema
interface VideoGenerationResponse {
  success: boolean
  data: {
    taskId: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
    videoUrl?: string       // Available when completed
    thumbnailUrl?: string   // Video thumbnail
    duration?: number       // Video length in seconds
    estimatedTime?: number  // Processing time estimate
    progress?: number       // 0-100 completion percentage
  }
  metadata: {
    presenterId: string
    resolution: string
    format: string
    fileSize?: number
    processingTime?: number
  }
}

// Status Check Endpoint: GET `/api/generate/video/:taskId`
interface VideoStatusResponse {
  taskId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number        // 0-100
  estimatedTimeRemaining?: number
  videoUrl?: string
  error?: {
    code: string
    message: string
  }
}
```

### Async Processing Flow

```javascript
// Task Queue Management
class VideoGenerationQueue {
  constructor() {
    this.queue = new Bull('video-generation', {
      redis: process.env.REDIS_URL,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 10000
        }
      }
    });
    
    this.queue.process('generate-video', this.processVideoJob.bind(this));
  }
  
  async addVideoJob(requestData) {
    const job = await this.queue.add('generate-video', requestData, {
      priority: requestData.priority === 'high' ? 10 : 1,
      delay: 0
    });
    
    return {
      taskId: job.id,
      status: 'queued',
      estimatedTime: this.estimateProcessingTime(requestData)
    };
  }
  
  async processVideoJob(job) {
    const { script, audioUrl, presenterId } = job.data;
    
    // Update progress throughout processing
    await job.progress(10); // Started
    
    const videoResult = await generateVideo({ audioUrl }, script);
    await job.progress(60); // D-ID processing complete
    
    const processedVideo = await processCompletedVideo(videoResult.videoUrl);
    await job.progress(90); // Post-processing complete
    
    await job.progress(100); // Fully complete
    
    return processedVideo;
  }
}
```

## ⚡ Performance & Scalability

### Caching Strategy

```javascript
// Multi-Tier Caching for Video Content
const VIDEO_CACHE = {
  // Level 1: Generated video cache (hash of script + voice)
  videoCache: {
    storage: 'redis',
    ttl: 7 * 24 * 60 * 60 * 1000,  // 7 days
    keyPattern: 'video:{script_hash}:{voice_id}'
  },
  
  // Level 2: CDN caching for delivery
  cdnCache: {
    provider: 'cloudflare',
    ttl: 30 * 24 * 60 * 60 * 1000,  // 30 days
    edgeCache: true
  },
  
  // Level 3: Browser caching
  browserCache: {
    cacheControl: 'public, max-age=86400',  // 24 hours
    etag: true
  }
}

// Cache Key Generation
function generateVideoCacheKey(script, audioUrl, presenterId) {
  const contentHash = crypto
    .createHash('sha256')
    .update(`${script}:${audioUrl}:${presenterId}`)
    .digest('hex');
  return `video:${contentHash}`;
}
```

### Resource Management

```javascript
// Concurrent Processing Limits
const PROCESSING_LIMITS = {
  maxConcurrentVideos: 5,      // Limit D-ID API calls
  maxConcurrentProcessing: 3,  // Limit ffmpeg processes
  maxQueueSize: 100,           // Maximum queued jobs
  processingTimeout: 300000,   // 5 minutes max processing
  
  // Resource allocation per job
  memoryLimitMB: 1024,         // 1GB per video job
  cpuLimitPercent: 25          // 25% CPU per job
}

// Queue Health Monitoring
async function monitorQueueHealth() {
  const queueStats = await this.queue.getJobCounts();
  
  if (queueStats.waiting > PROCESSING_LIMITS.maxQueueSize) {
    throw new CapacityError('Video generation queue at capacity');
  }
  
  if (queueStats.active > PROCESSING_LIMITS.maxConcurrentVideos) {
    // Scale processing or implement backpressure
    await this.implementBackpressure();
  }
}
```

## 🛡️ Security & Content Safety

### Content Moderation

```javascript
// Script and Content Validation
async function validateVideoContent(script, audioUrl) {
  // Text content moderation
  const textModeration = await moderateText(script);
  if (textModeration.flagged) {
    throw new ContentModerationError('Script contains inappropriate content');
  }
  
  // Audio content validation
  const audioModeration = await moderateAudio(audioUrl);
  if (audioModeration.flagged) {
    throw new ContentModerationError('Audio contains inappropriate content');
  }
  
  // Length and complexity validation
  if (script.length > 1000) {
    throw new ValidationError('Script too long for video generation');
  }
  
  return { approved: true, moderationId: textModeration.id };
}
```

### Access Control & Rate Limiting

```javascript
// User-based Rate Limiting
const USER_LIMITS = {
  anonymous: {
    videosPerHour: 3,
    videosPerDay: 10,
    maxConcurrent: 1
  },
  authenticated: {
    videosPerHour: 10,
    videosPerDay: 50,
    maxConcurrent: 2
  },
  premium: {
    videosPerHour: 50,
    videosPerDay: 200,
    maxConcurrent: 5
  }
}

// IP-based Protection
const IP_PROTECTION = {
  maxRequestsPerMinute: 10,
  maxConcurrentFromIP: 3,
  blockDuration: 300000,  // 5 minutes
  whitelistedIPs: process.env.WHITELIST_IPS?.split(',') || []
}
```

## 🧪 Testing Strategy

### Unit Test Coverage

```javascript
// Required Test Categories
describe('Video Agent', () => {
  describe('D-ID Integration', () => {
    test('creates talk request with correct parameters');
    test('polls video status until completion');
    test('handles D-ID API errors gracefully');
    test('validates presenter configuration');
  });

  describe('Video Processing', () => {
    test('processes raw video with correct specs');
    test('generates thumbnail from video');
    test('optimizes video file size and quality');
    test('handles processing errors and timeouts');
  });

  describe('Queue Management', () => {
    test('adds jobs to queue with correct priority');
    test('processes jobs in order');
    test('handles job failures and retries');
    test('manages concurrent processing limits');
  });

  describe('Content Safety', () => {
    test('validates script content appropriateness');
    test('blocks inappropriate audio content');
    test('respects content length limits');
    test('logs moderation decisions');
  });
});
```

### Integration Testing

```javascript
// End-to-End Video Generation Tests
describe('Video Generation Flow', () => {
  test('generates video from script and audio', async () => {
    const result = await generateVideo(mockAudioData, mockScript);
    expect(result.videoUrl).toBeDefined();
    expect(result.duration).toBeGreaterThan(0);
    expect(result.fileSize).toBeLessThan(VIDEO_SPECS.maxFileSize);
  });

  test('handles D-ID service unavailability', async () => {
    // Mock D-ID API failure
    nock('https://api.d-id.com').post('/talks').reply(503);
    
    await expect(generateVideo(mockAudioData, mockScript))
      .rejects.toThrow(ServiceError);
  });

  test('processes video queue under load', async () => {
    // Add multiple jobs simultaneously
    const jobs = Array.from({ length: 10 }, () => 
      videoQueue.addVideoJob(mockJobData)
    );
    
    const results = await Promise.allSettled(jobs);
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(10);
  });
});
```

### Performance Testing

```javascript
// Load Testing Scenarios
const PERFORMANCE_TESTS = {
  concurrent_generation: {
    description: 'Multiple videos generating simultaneously',
    concurrent_users: 10,
    duration: '5m',
    success_rate: 0.95
  },
  
  queue_capacity: {
    description: 'Queue handling at maximum capacity',
    job_rate: '2/second',
    duration: '10m',
    max_queue_time: 30000  // 30 seconds
  },
  
  memory_usage: {
    description: 'Memory usage during video processing',
    max_memory_mb: 2048,
    concurrent_jobs: 5
  }
}
```

## 📁 File Structure

```
backend/
├── video/
│   ├── generateVideo.js           # Main entry point
│   ├── services/
│   │   ├── didService.js         # D-ID API integration
│   │   ├── videoProcessor.js     # ffmpeg processing
│   │   ├── storageService.js     # File upload/download
│   │   └── queueService.js       # Job queue management
│   ├── middleware/
│   │   ├── contentModeration.js  # Content safety checks
│   │   ├── rateLimiting.js       # Rate limit enforcement
│   │   └── videoValidation.js    # Input validation
│   ├── utils/
│   │   ├── videoOptimizer.js     # Video compression/optimization
│   │   ├── thumbnailGenerator.js # Thumbnail creation
│   │   └── progressTracker.js    # Job progress tracking
│   └── __tests__/
│       ├── integration/
│       ├── unit/
│       └── performance/
```

## ✅ Success Criteria

### Functional Requirements ✓
- [ ] Generates 512x512 talking avatar videos from script + audio
- [ ] Processes videos within 60 seconds for standard requests
- [ ] Delivers optimized MP4 files under 10MB
- [ ] Provides real-time progress updates during generation
- [ ] Handles queue management for concurrent requests

### Technical Requirements ✓
- [ ] D-ID API integration with robust error handling
- [ ] ffmpeg-based video post-processing pipeline
- [ ] Redis-based job queue for async processing
- [ ] CDN integration for fast video delivery
- [ ] Comprehensive content moderation system

### Quality Requirements ✓
- [ ] Video quality suitable for web playback
- [ ] Lip-sync accuracy matching audio input
- [ ] Processing success rate above 95%
- [ ] Average processing time under 45 seconds
- [ ] Test coverage above 85% for critical paths

## 🚫 Boundaries & Constraints

### What This Agent SHOULD Do
- Generate talking avatar videos using D-ID
- Process and optimize video outputs
- Manage video generation job queues
- Handle video file storage and delivery
- Implement content safety and moderation

### What This Agent SHOULD NOT Do
- Generate or process audio content
- Handle frontend user interface logic
- Manage user authentication or sessions
- Implement business logic outside video generation
- Process non-avatar video content

## 🔗 Integration Points

### Audio Agent Dependencies
```javascript
// Expected Input from Audio Agent
interface AudioInput {
  script: string      // Text for lip-sync
  audioUrl: string    // URL to speech audio
  duration: number    // Audio length in seconds
  voiceId: string     // Voice identifier for consistency
}
```

### Frontend Integration
```javascript
// Video Status Polling Pattern
async function pollVideoStatus(taskId) {
  const poll = async () => {
    const response = await fetch(`/api/generate/video/${taskId}`);
    const status = await response.json();
    
    if (status.status === 'completed') {
      return status.data.videoUrl;
    }
    
    if (status.status === 'failed') {
      throw new Error(status.error.message);
    }
    
    // Continue polling
    setTimeout(poll, 2000);
  };
  
  return poll();
}
```

### Webhook Integration
```javascript
// Completion Notification
interface WebhookPayload {
  taskId: string
  status: 'completed' | 'failed'
  videoUrl?: string
  error?: {
    code: string
    message: string
  }
  metadata: {
    processingTime: number
    fileSize: number
    duration: number
  }
}
``` 