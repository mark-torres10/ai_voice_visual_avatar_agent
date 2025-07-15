# AI Avatar MVP — Parallel Agent Spec

This spec defines the initial modular components for a talking avatar MVP. It is designed for agentic execution using Cursor. Each component is independently buildable and testable, then integrated into a unified app.

---

## 🧩 System Overview

The system lets users input text, which is:
1. Converted into a natural language script (via GPT-4o)
2. Transformed into an audio clip (via ElevenLabs)
3. Rendered into a talking-head video using D-ID
4. Displayed in a browser-based UI built with Next.js

---

## 📁 Folder Structure
/frontend ← Next.js frontend for chat + video display
/backend ← REST API services for GPT-4o, ElevenLabs, D-ID
/planning ← Planning specs and system design
/rules ← Agent-specific workflows

---

## 🚀 Parallel Agent Tasks

### 🧑‍💻 AGENT 1: Setup Frontend UI

📁: `frontend/`

Goal: Build a minimal React/Next.js UI that allows text input and displays a generated video.

Tasks:
- [ ] Create a Next.js app (`pages/index.tsx`)
- [ ] Add a text box + "Send" button
- [ ] Add a `<video>` element to preview the result
- [ ] Connect to `/api/generate` backend route (to be implemented by Agent 2/3)
- [ ] Deploy to Vercel (`vercel.json` optional)

Success Criteria:
- Typing a message and clicking "Send" triggers video playback (stubbed response OK for now)

---

### 🧑‍🔬 AGENT 2: GPT-4o → Script → ElevenLabs (TTS)

📁: `backend/generateScriptAndAudio.js`

Goal: Write backend logic to:
1. Generate a short reply script using GPT-4o-mini
2. Convert the script to speech using ElevenLabs
3. Return a public URL or base64-encoded audio

Tasks:
- [ ] Call GPT-4o API with prompt
- [ ] Pass resulting script to ElevenLabs
- [ ] Store or serve audio buffer (e.g., return audio as base64 for now)
- [ ] Export as POST `/api/generate/audio` route

Inputs:
```json
{
  "userMessage": "What do you love cooking?"
}
```

Outputs:
```json
{
  "script": "I love making adobo...",
  "audioUrl": "https://yourdomain.com/audio.mp3"
}
```

### 🧑‍🎨 AGENT 3: Script + Audio → D-ID Avatar

📁: backend/generateVideo.js

Goal: Given a script + audio, call D-ID API and return a video URL.

Tasks:

 Accept a POST request with script + audio URL or buffer

 Pass inputs to D-ID /talks API

 Poll or wait for video generation to complete

 Return video URL

Inputs:
```json
{
  "script": "I love making adobo...",
  "audioUrl": "https://yourdomain.com/audio.mp3"
}
```

Output:
```json
{
  "videoUrl": "https://d-id.com/generated/video.mp4"
}
```

### 🔗 Integration Flow
When the user types a message in the frontend:

Frontend calls /api/generate (wrapper)

Wrapper route:

Calls /generate/audio → gets script + audioUrl

Passes result to /generate/video

Returns videoUrl to frontend

Frontend renders the video

### ✅ Demo Requirements (End of Day)
Deployed Vercel frontend with working video display

GPT-4o → ElevenLabs → D-ID pipeline wired end-to-end

Video generation takes ≤30s per response

### 📁 Suggested Agent Rules
Put these markdowns in /rules/ to trigger and constrain each agent:

/rules/frontend-agent.md

/rules/audio-agent.md

/rules/video-agent.md

Each should:

Define inputs/outputs clearly

Set scope of agent control (e.g., only modify frontend/)

Include sample payloads and success criteria

### 🔚 Notes
Use placeholders where external assets are not yet available

Make each module runnable via npm run dev or node script.js

Add .env with API keys and read from it in backend

---

## 🛠️ Setup Guide: ElevenLabs & D-ID

### 🎤 ElevenLabs (Text-to-Speech)

**Goal:** Turn GPT-4 output into high-quality audio in your own cloned voice (or default voice)
