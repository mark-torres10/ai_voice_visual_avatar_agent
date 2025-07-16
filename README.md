# AI Avatar: Bring Your Words to Life

Imagine chatting with an AI that not only understands you, but also talks back—just like a real person. With the **AI Avatar MVP**, your words become a voice, and your voice becomes a face. Type a message, and watch as your personal AI avatar responds with natural speech and expressive video.

---

## ✨ Features

- **Instant AI Video Replies**: Type a message and watch a digital avatar respond in seconds.
- **Lifelike Voice & Video**: Cutting-edge AI voices and realistic facial animation.
- **Seamless Experience**: No technical setup—just type, send, and watch.
- **Powered by Leading AI**: Combines GPT (OpenAI), ElevenLabs, and D-ID for best-in-class results.
- **Privacy & Security**: Your messages are processed securely; no data is shared with third parties.

---

## 🚀 How It Works

1. **Type a message** in the chat box.
2. **AI writes a reply** using GPT-4o (OpenAI).
3. **Voice is generated** with ElevenLabs for natural, human-like speech.
4. **Avatar video is created** by D-ID, animating a photo to speak your message.
5. **Watch and listen** as your AI avatar responds—instantly!

---

## 🤖 Why This Matters

This app is a showcase of modern AI agent orchestration:
- **Text, voice, and video agents** work together seamlessly.
- **Real-world AI pipeline**: Demonstrates how advanced AI services can be combined for rich, interactive experiences.
- **Accessible to everyone**: No coding or special hardware required—just your browser.

---

## 🔮 Future Directions

- **Custom Avatars**: Upload your own photo or choose from a gallery.
- **Voice Personalization**: Support for custom voices or accents.
- **Real-Time Streaming**: Even faster, more interactive replies.
- **Emotion & Expression Control**: Set the mood or emotion of your avatar's reply.
- **Multi-language Support**: Converse in your preferred language.
- **Mobile & Accessibility**: Enhanced support for all users and devices.
- **Messaging Platform Integration**: Bring AI avatars to your favorite chat apps.

---

## 🛠️ Setup (For Developers)

### 1. Install dependencies:
```bash
cd backend/audio
npm install
```

### 2. Configure API keys:
Update `.env` (in root directory) with your actual API keys:
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
ELEVENLABS_API_KEY=your-actual-elevenlabs-key-here
DEFAULT_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

### 3. Run the audio generator:
```bash
cd backend/audio
npm start
```

---

## 🧩 Technical Overview

- **Frontend**: Next.js/React app for chat, audio, and video playback.
- **API Routes**: `/api/generate/audio` (script + audio), `/api/generate/video` (video from script/audio).
- **Backend**: Integrates GPT-4o, ElevenLabs, and D-ID; manages file storage and security.
- **Media Handling**: Timestamped audio files, video streaming from D-ID.
- **UI**: Modern, user-friendly chat interface.

### File Structure
```
ai_voice_visual_avatar_agent/
├── backend/
│   ├── audio/
│   │   ├── generateScriptAndAudio.js      # Main entry for script/audio generation
│   │   ├── server.js                      # Express server for audio API
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── services/
│   │   │   ├── gpt4oService.js            # OpenAI GPT-4o integration
│   │   │   └── elevenlabsService.js       # ElevenLabs TTS integration
│   │   └── utils/
│   │       └── audioProcessor.js          # Audio file handling
│   └── video/
│       ├── generateVideo.js               # Main entry for video generation
│       ├── testDidService.js              # Test script for D-ID service
│       ├── quickstart.js                  # Quick setup script
│       ├── package.json
│       ├── package-lock.json
│       ├── services/
│       │   └── didService.js              # D-ID API integration
│       ├── middleware/
│       │   └── videoValidation.js         # Input validation for video
│       └── examples/
│           └── basicUsage.js              # Example usage script
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                     # Root layout
│   │   ├── page.tsx                       # Main page (chat UI)
│   │   ├── globals.css                    # Global styles
│   │   └── api/
│   │       └── generate/
│   │           ├── audio/
│   │           │   └── route.ts           # API route for audio generation
│   │           └── video/
│   │               └── route.ts           # API route for video generation
│   ├── components/
│   │   ├── ChatInterface.tsx              # Main chat component
│   │   ├── InputArea.tsx                  # Message input
│   │   ├── VideoPlayer.tsx                # Video display
│   │   └── ui/
│   │       └── Button.tsx                 # Reusable button
│   ├── lib/
│   │   ├── api.ts                         # API helpers
│   │   ├── utils.ts                       # Utility functions
│   │   └── types.ts                       # TypeScript types
│   ├── __tests__/
│   │   ├── ChatInterface.test.tsx
│   │   └── api-generate-audio.test.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── README.md
├── planning/
│   ├── AUDIO_INTEGRATION_V2_IMPLEMENTATION.md
│   ├── SCRIPT_VOICE_IMPLEMENTATION_SUMMARY.md
│   ├── VIDEO_IMPLEMENTATION_SUMMARY.md
│   ├── spec.md
│   ├── specs_v2.md
│   └── specs_v3.md
├── public/
│   ├── generic_secretary_stock_image.jpg
│   ├── personal_picture.jpg
│   └── [generated audio files].mp3
├── README.md
└── rules/
    ├── AGENT_CONVERSATION_STYLE.md
    ├── audio-agent.md
    ├── frontend-agent.md
    └── video-agent.md
```

---

## ✅ Success Criteria

- Type a message, get a conversational script via GPT-4o
- Script converted to high-quality MP3 audio via ElevenLabs
- Audio files saved with timestamp naming convention
- Files stored in public/ directory for easy access
- Most recent audio file can be identified for playback
- Video generated and played back in browser

---

## 💡 Try It Now

Open your browser, type a message, and watch your AI avatar come to life!
