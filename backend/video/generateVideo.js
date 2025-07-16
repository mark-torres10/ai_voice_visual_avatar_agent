import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import DidService from './services/didService.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize D-ID Service
let didService;
try {
  didService = new DidService();
  console.log('D-ID Service initialized successfully');
} catch (error) {
  console.error('Failed to initialize D-ID Service:', error.message);
  console.error('Make sure D_ID_API_KEY is set in your .env file');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AI Avatar Video Generator',
    timestamp: new Date().toISOString(),
    didServiceReady: !!didService
  });
});

// Main video generation endpoint
app.post('/api/generate/video', async (req, res) => {
  try {
    const { script, audioUrl, presenterId, photoUrl } = req.body;
    console.log('[VIDEO API] Received request:', { script, audioUrl, presenterId, photoUrl });

    // Validate required inputs
    if (!script || !audioUrl) {
      console.error('[VIDEO API] Missing required fields', { script, audioUrl });
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: 'Both script and audioUrl are required'
        }
      });
    }

    // Validate script length (D-ID has limits)
    if (script.length > 1000) {
      console.error('[VIDEO API] Script too long', { scriptLength: script.length });
      return res.status(400).json({
        success: false,
        error: {
          code: 'SCRIPT_TOO_LONG',
          message: 'Script must be less than 1000 characters'
        }
      });
    }

    // Validate audioUrl format
    if (!audioUrl.startsWith('http')) {
      console.error('[VIDEO API] Invalid audioUrl', { audioUrl });
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_AUDIO_URL',
          message: 'audioUrl must be a valid HTTP URL'
        }
      });
    }

    // Determine which presenter image to use
    let effectivePresenterId = presenterId;
    if (photoUrl && typeof photoUrl === 'string' && photoUrl.length > 0) {
      if (photoUrl.startsWith('/')) {
        const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
        const protocol = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
        effectivePresenterId = `${protocol}://${host}${photoUrl}`;
        console.log('[VIDEO API] Resolved photoUrl to absolute URL:', effectivePresenterId);
      } else {
        effectivePresenterId = photoUrl;
        console.log('[VIDEO API] Using provided photoUrl as presenter:', effectivePresenterId);
      }
    } else {
      console.log('[VIDEO API] Using default presenterId:', effectivePresenterId);
    }

    if (!didService) {
      console.error('[VIDEO API] D-ID service not initialized');
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'D-ID service is not properly configured'
        }
      });
    }

    console.log('[VIDEO API] Calling didService.generateVideo with:', {
      audioUrl,
      script,
      presenterId: effectivePresenterId
    });

    // Generate video using D-ID service
    const result = await didService.generateVideo({
      audioUrl,
      script,
      presenterId: effectivePresenterId
    });

    if (result.success) {
      console.log('[VIDEO API] Video generation successful:', {
        taskId: result.data.taskId,
        duration: result.data.duration,
        videoUrl: result.data.videoUrl
      });

      res.json({
        success: true,
        data: {
          taskId: result.data.taskId,
          status: result.data.status,
          videoUrl: result.data.videoUrl,
          duration: result.data.duration,
          estimatedTime: null, // Already completed
          progress: 100
        },
        metadata: result.metadata
      });
    } else {
      console.error('[VIDEO API] Video generation failed:', result.error);
      
      const statusCode = result.error.code?.includes('401') ? 401 :
                        result.error.code?.includes('402') ? 402 :
                        result.error.code?.includes('429') ? 429 : 500;

      res.status(statusCode).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('[VIDEO API] Unexpected error in video generation endpoint:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during video generation',
        details: error instanceof Error ? error.message : String(error)
      }
    });
  }
});

// Get available presenters endpoint
app.get('/api/presenters', (req, res) => {
  if (!didService) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'D-ID service is not properly configured'
      }
    });
  }

  try {
    const presenters = didService.getAvailablePresenters();
    res.json({
      success: true,
      data: presenters
    });
  } catch (error) {
    console.error('Error fetching presenters:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch available presenters'
      }
    });
  }
});

// Test endpoint for debugging
app.post('/api/test/video', async (req, res) => {
  try {
    console.log('Test endpoint called with body:', req.body);
    
    // Mock response for testing without hitting D-ID API
    const mockResponse = {
      success: true,
      data: {
        taskId: 'test-' + Date.now(),
        status: 'completed',
        videoUrl: 'https://example.com/test-video.mp4',
        duration: 10,
        estimatedTime: null,
        progress: 100
      },
      metadata: {
        presenterId: 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
        resolution: '512x512',
        format: 'mp4'
      }
    };

    res.json(mockResponse);
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TEST_ERROR',
        message: error.message
      }
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: {
      code: 'UNHANDLED_ERROR',
      message: 'An unexpected server error occurred'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 AI Avatar Video Generator running on port ${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
    console.log(`🎬 Video generation: POST http://localhost:${PORT}/api/generate/video`);
    console.log(`👥 Presenters: GET http://localhost:${PORT}/api/presenters`);
    console.log(`🧪 Test endpoint: POST http://localhost:${PORT}/api/test/video`);
    
    if (!process.env.D_ID_API_KEY || process.env.D_ID_API_KEY === 'your_did_api_key_here') {
      console.warn('⚠️  Warning: D_ID_API_KEY not configured. Please update your .env file.');
    }
  });
}

export default app;