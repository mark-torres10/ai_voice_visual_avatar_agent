import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// D-ID Configuration
const DID_CONFIG = {
  baseUrl: process.env.DID_API_URL || 'https://api.d-id.com',
  apiVersion: 'v1',
  timeout: 120000,  // 2 minutes for video generation
  retryAttempts: 3,
  retryDelay: 5000
};

// Default Presenter Configuration
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
};

class DidService {
  constructor() {
    this.apiKey = process.env.DID_API_KEY;
    this.baseUrl = DID_CONFIG.baseUrl;
    
    if (!this.apiKey) {
      throw new Error('DID_API_KEY is required in environment variables');
    }
    
    this.client = axios.create({
      baseURL: `${this.baseUrl}`,
      timeout: DID_CONFIG.timeout,
      headers: {
        'Authorization': `Basic ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Create a talk request with D-ID API
   * @param {Object} params - Talk parameters
   * @param {string} params.audioUrl - URL to audio file
   * @param {string} params.script - Text script for lip-sync
   * @param {string} params.presenterId - Optional presenter override
   * @returns {Promise<Object>} Talk request response
   */
  async createTalkRequest({ audioUrl, script, presenterId }) {
    try {
      const presenterUrl = presenterId || PRESENTER_CONFIG.sourceUrl;
      
      const requestData = {
        source_url: presenterUrl,
        script: {
          type: 'audio',
          audio_url: audioUrl,
          reduce_noise: true,
          ssml: false
        },
        config: {
          result_format: 'mp4',
          fluent: true,
          pad_audio: 0.0,
          stitch: true,
          align_driver: true,
          align_expand_factor: 1.0
        }
      };

      console.log('Creating D-ID talk request:', {
        presenterUrl,
        audioUrl: audioUrl.substring(0, 50) + '...',
        scriptLength: script?.length || 0
      });

      const response = await this.client.post('/talks', requestData);
      
      console.log('D-ID talk request created:', {
        id: response.data.id,
        status: response.data.status
      });

      return response.data;
      
    } catch (error) {
      console.error('Error creating D-ID talk request:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      throw this.handleDidApiError(error, 'createTalkRequest');
    }
  }

  /**
   * Poll for video generation status
   * @param {string} talkId - Talk request ID
   * @returns {Promise<Object>} Completed video data
   */
  async pollVideoStatus(talkId) {
    const maxAttempts = 60; // 5 minutes max (5 second intervals)
    let attempts = 0;

    console.log(`Starting to poll video status for talk ID: ${talkId}`);

    while (attempts < maxAttempts) {
      try {
        const response = await this.client.get(`/talks/${talkId}`);
        const status = response.data.status;
        
        console.log(`Poll attempt ${attempts + 1}: Status = ${status}`);

        switch (status) {
          case 'done':
            console.log('Video generation completed successfully');
            return {
              id: response.data.id,
              status: response.data.status,
              videoUrl: response.data.result_url,
              createdAt: response.data.created_at,
              duration: response.data.duration
            };

          case 'error':
          case 'rejected':
            console.error('Video generation failed:', response.data);
            throw new Error(`Video generation failed: ${response.data.error?.description || 'Unknown error'}`);

          case 'created':
          case 'started':
            // Continue polling
            break;

          default:
            console.warn(`Unknown status: ${status}`);
        }

        attempts++;
        await this.sleep(DID_CONFIG.retryDelay);
        
      } catch (error) {
        console.error(`Error polling video status (attempt ${attempts + 1}):`, error.message);
        
        if (attempts >= DID_CONFIG.retryAttempts) {
          throw this.handleDidApiError(error, 'pollVideoStatus');
        }
        
        attempts++;
        await this.sleep(DID_CONFIG.retryDelay);
      }
    }

    throw new Error(`Video generation timeout: exceeded ${maxAttempts} polling attempts`);
  }

  /**
   * Generate complete video from audio URL and script
   * @param {Object} params - Generation parameters
   * @param {string} params.audioUrl - URL to audio file
   * @param {string} params.script - Text script for lip-sync
   * @param {string} params.presenterId - Optional presenter override
   * @returns {Promise<Object>} Complete video generation result
   */
  async generateVideo({ audioUrl, script, presenterId }) {
    try {
      console.log('Starting video generation process');
      
      // Step 1: Create talk request
      const talkRequest = await this.createTalkRequest({
        audioUrl,
        script,
        presenterId
      });

      // Step 2: Poll for completion
      const completedVideo = await this.pollVideoStatus(talkRequest.id);

      console.log('Video generation completed:', {
        id: completedVideo.id,
        videoUrl: completedVideo.videoUrl?.substring(0, 50) + '...',
        duration: completedVideo.duration
      });

      return {
        success: true,
        data: {
          taskId: completedVideo.id,
          status: 'completed',
          videoUrl: completedVideo.videoUrl,
          duration: completedVideo.duration,
          createdAt: completedVideo.createdAt
        },
        metadata: {
          presenterId: presenterId || PRESENTER_CONFIG.sourceUrl,
          resolution: PRESENTER_CONFIG.resolution,
          format: PRESENTER_CONFIG.format
        }
      };

    } catch (error) {
      console.error('Video generation failed:', error.message);
      
      return {
        success: false,
        error: {
          code: error.code || 'VIDEO_GENERATION_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Handle D-ID API errors with proper mapping
   * @param {Error} error - The error object
   * @param {string} context - Context where error occurred
   * @returns {Error} Mapped error
   */
  handleDidApiError(error, context) {
    const status = error.response?.status;
    
    const errorMap = {
      400: () => new Error('Invalid video generation parameters'),
      401: () => new Error('Invalid D-ID API credentials'),
      402: () => new Error('D-ID quota exceeded or payment required'),
      429: () => new Error('D-ID rate limit exceeded'),
      500: () => new Error('D-ID service temporarily unavailable'),
      503: () => new Error('D-ID service overloaded')
    };
    
    const mappedError = errorMap[status];
    if (mappedError) {
      const err = mappedError();
      err.code = `DID_API_${status}`;
      return err;
    }
    
    // Log unexpected errors for investigation
    console.error('Unexpected D-ID API error:', {
      status,
      message: error.message,
      context,
      timestamp: new Date().toISOString()
    });
    
    const unexpectedError = new Error('Unexpected video generation error');
    unexpectedError.code = 'DID_API_UNEXPECTED';
    return unexpectedError;
  }

  /**
   * Utility function for delays
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get available presenters
   * @returns {Array} List of available presenter configurations
   */
  getAvailablePresenters() {
    return [
      { id: 'alice', url: PRESENTER_CONFIG.sourceUrl, name: 'Alice (Default)' },
      { id: 'amy', url: PRESENTER_CONFIG.alternatives[0], name: 'Amy (Professional)' },
      { id: 'noah', url: PRESENTER_CONFIG.alternatives[1], name: 'Noah (Professional)' },
      { id: 'emma', url: PRESENTER_CONFIG.alternatives[2], name: 'Emma (Casual)' }
    ];
  }
}

export default DidService;