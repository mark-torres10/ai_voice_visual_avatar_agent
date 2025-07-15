# AI Avatar Audio Integration

GPT + ElevenLabs voice integration for AI Avatar MVP.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API keys:**
   
   Update `.env` with your actual API keys:
   ```env
   OPENAI_API_KEY=sk-your-actual-openai-key-here
   ELEVENLABS_API_KEY=your-actual-elevenlabs-key-here
   DEFAULT_VOICE_ID=EXAVITQu4vr4xnSDxMaL
   ```

3. **Run the audio generator:**
   ```bash
   npm start
   ```

## How it works

1. **Script Generation**: Uses GPT-4o-mini to generate a conversational response to a hardcoded question
2. **Text-to-Speech**: Converts the script to audio using ElevenLabs API  
3. **File Storage**: Saves audio files in `public/` with timestamp-based names (YYYY-MM-DD_HHMMSS.mp3)
4. **Audio Polling**: The system is designed to always use the most recent .mp3 file

## File Structure

```
backend/
├── audio/
│   ├── generateScriptAndAudio.js    # Main entry point
│   ├── services/
│   │   ├── gpt4oService.js         # OpenAI GPT-4o integration
│   │   └── elevenlabsService.js    # ElevenLabs TTS integration  
│   └── utils/
│       └── audioProcessor.js       # Audio file handling
public/                             # Generated audio files
```

## Success Criteria

✅ Hardcoded question generates conversational script via GPT-4o  
✅ Script converted to high-quality MP3 audio via ElevenLabs  
✅ Audio files saved with timestamp naming convention  
✅ Files stored in public/ directory for easy access  
✅ Most recent audio file can be identified for playback
