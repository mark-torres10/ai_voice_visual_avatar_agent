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

    // Validate required inputs
    if (!script || !audioUrl) {
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
      // If photoUrl is a relative path, convert to absolute/public URL
      if (photoUrl.startsWith('/')) {
        // Assume running behind a proxy or on Vercel, so use the public URL
        const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
        const protocol = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
        effectivePresenterId = `${protocol}://${host}${photoUrl}`;
      } else {
        effectivePresenterId = photoUrl;
      }
    }

    if (!didService) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'D-ID service is not properly configured'
        }
      });
    }

    console.log('Received video generation request:', {
      scriptLength: script.length,
      audioUrl: audioUrl.substring(0, 50) + '...',
      presenterId: effectivePresenterId || 'default',
      timestamp: new Date().toISOString()
    });

    // Generate video using D-ID service
    const result = await didService.generateVideo({
      audioUrl,
      script,
      presenterId: effectivePresenterId
    });

    if (result.success) {
      console.log('Video generation successful:', {
        taskId: result.data.taskId,
        duration: result.data.duration
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
      console.error('Video generation failed:', result.error);
      
      const statusCode = result.error.code?.includes('401') ? 401 :
                        result.error.code?.includes('402') ? 402 :
                        result.error.code?.includes('429') ? 429 : 500;

      res.status(statusCode).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Unexpected error in video generation endpoint:', error);
    
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during video generation'
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