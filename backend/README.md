# AI Avatar Video Generation Backend

This backend service provides D-ID avatar video generation capabilities for the AI Avatar MVP. It converts text scripts and audio files into talking-head videos using D-ID's Creative Reality Studio API.

## 🚀 Features

- **D-ID Integration**: Direct integration with D-ID API for high-quality avatar video generation
- **Multiple Presenters**: Support for different avatar presenters (Alice, Amy, Noah, Emma)
- **Robust Error Handling**: Comprehensive error mapping and retry logic
- **Input Validation**: Request validation and sanitization
- **Real-time Processing**: Synchronous video generation with polling
- **RESTful API**: Clean REST endpoints for video generation
- **Health Monitoring**: Health check and service status endpoints

## 📋 Prerequisites

- Node.js 18+ 
- D-ID API account and API key
- Audio files hosted on publicly accessible URLs

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

3. **Set up your D-ID API key:**
   - Get your API key from [D-ID Studio](https://studio.d-id.com/)
   - Add it to your `.env` file:
     ```
     DID_API_KEY=your_actual_api_key_here
     ```

## 🎯 API Endpoints

### Main Video Generation

**POST** `/api/generate/video`

Generate a talking avatar video from script and audio.

**Request Body:**
```json
{
  "script": "Hello! This is a test of the avatar system.",
  "audioUrl": "https://example.com/audio.mp3",
  "presenterId": "alice" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "talk_123456789",
    "status": "completed",
    "videoUrl": "https://d-id.com/generated/video.mp4",
    "duration": 15.2,
    "progress": 100
  },
  "metadata": {
    "presenterId": "https://d-id-public-bucket.s3.amazonaws.com/alice.jpg",
    "resolution": "512x512",
    "format": "mp4"
  }
}
```

### Available Presenters

**GET** `/api/presenters`

Get list of available avatar presenters.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "alice",
      "url": "https://d-id-public-bucket.s3.amazonaws.com/alice.jpg",
      "name": "Alice (Default)"
    },
    {
      "id": "amy",
      "url": "https://d-id-public-bucket.s3.amazonaws.com/amy.jpg",
      "name": "Amy (Professional)"
    }
  ]
}
```

### Health Check

**GET** `/health`

Check service health and configuration.

**Response:**
```json
{
  "status": "ok",
  "service": "AI Avatar Video Generator",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "didServiceReady": true
}
```

### Test Endpoint

**POST** `/api/test/video`

Test endpoint that returns mock data without calling D-ID API.

## 🏃‍♂️ Running the Service

### Development Mode
```bash
npm run dev
# Server runs on http://localhost:3001
```

### Production Mode
```bash
npm start
```

### Run Tests
```bash
# Test the D-ID service directly
node testDidService.js

# Run unit tests (when implemented)
npm test
```

## 📝 Usage Examples

### Basic Video Generation

```javascript
// Using fetch API
const response = await fetch('http://localhost:3001/api/generate/video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    script: "Welcome to our AI avatar demonstration!",
    audioUrl: "https://example.com/welcome.mp3"
  })
});

const result = await response.json();
console.log('Generated video:', result.data.videoUrl);
```

### Using cURL

```bash
# Generate video
curl -X POST http://localhost:3001/api/generate/video \
  -H "Content-Type: application/json" \
  -d '{
    "script": "Hello world from AI avatar!",
    "audioUrl": "https://example.com/hello.mp3",
    "presenterId": "amy"
  }'

# Check health
curl http://localhost:3001/health

# Get available presenters
curl http://localhost:3001/api/presenters
```

### Using the Test Script

```bash
# Run comprehensive test
node testDidService.js
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DID_API_KEY` | Your D-ID API key | Required |
| `DID_API_URL` | D-ID API base URL | `https://api.d-id.com` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |

### D-ID Configuration

The service is configured with optimized settings for web delivery:

- **Resolution**: 512x512 (optimized for web)
- **Format**: MP4 with H.264 codec
- **Frame Rate**: 25 FPS
- **Audio**: AAC codec
- **Quality**: High quality with noise reduction

## 🚨 Error Handling

The service provides comprehensive error handling for various scenarios:

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `MISSING_REQUIRED_FIELDS` | Missing script or audioUrl | 400 |
| `SCRIPT_TOO_LONG` | Script exceeds 1000 characters | 400 |
| `INVALID_AUDIO_URL` | Invalid audio URL format | 400 |
| `DID_API_401` | Invalid D-ID credentials | 401 |
| `DID_API_402` | Insufficient D-ID credits | 402 |
| `DID_API_429` | Rate limit exceeded | 429 |
| `SERVICE_UNAVAILABLE` | D-ID service unavailable | 500 |

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "DID_API_402",
    "message": "D-ID quota exceeded or payment required"
  }
}
```

## 📊 Performance

### Expected Performance Metrics

- **Video Generation Time**: 30-60 seconds per video
- **Video Size**: ~2-10MB for 30-second videos
- **Concurrent Requests**: Up to 5 simultaneous generations
- **Success Rate**: >95% under normal conditions

### Rate Limits

The service respects D-ID's rate limits:
- Standard accounts: 3 videos per hour
- Professional accounts: Variable based on plan

## 🔒 Security

### Input Validation

- Script content sanitization
- URL validation for audio inputs
- Request size limits (50MB max)
- Content length restrictions

### API Security

- CORS enabled for cross-origin requests
- Request validation middleware
- Error message sanitization
- No sensitive data in logs

## 🐛 Troubleshooting

### Common Issues

**1. "DID_API_KEY is required"**
- Solution: Add your D-ID API key to the `.env` file

**2. "D-ID quota exceeded"**
- Solution: Check your D-ID account credits and billing

**3. "Video generation timeout"**
- Solution: Check D-ID service status, try again with shorter content

**4. "Invalid audio URL"**
- Solution: Ensure audio file is publicly accessible via HTTPS

### Debug Mode

Enable detailed logging:
```bash
DEBUG=* npm run dev
```

### Test Without API Key

Use the test endpoint to verify functionality without using API credits:
```bash
curl -X POST http://localhost:3001/api/test/video \
  -H "Content-Type: application/json" \
  -d '{"script": "test", "audioUrl": "https://example.com/test.mp3"}'
```

## 📚 API Documentation

### Input Specifications

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `script` | string | Yes | 1000 chars | Text for lip-sync |
| `audioUrl` | string | Yes | - | Public HTTPS URL to audio |
| `presenterId` | string | No | - | Avatar presenter ID |

### Output Specifications

- **Video Format**: MP4
- **Resolution**: 512x512 pixels
- **Frame Rate**: 25 FPS
- **Audio Codec**: AAC
- **Max File Size**: ~10MB
- **Max Duration**: 60 seconds

## 🚀 Next Steps

1. **Integration**: Connect with audio generation service
2. **Frontend**: Integrate with React/Next.js frontend
3. **Queue System**: Add Redis-based job queuing for scalability
4. **Caching**: Implement video caching for common requests
5. **Analytics**: Add usage tracking and performance monitoring

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

---

For more information about D-ID API, visit [D-ID Documentation](https://docs.d-id.com/).