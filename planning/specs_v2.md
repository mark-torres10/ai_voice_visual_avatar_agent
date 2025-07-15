# AI Avatar MVP — v2 Spec: Frontend ↔ Audio Integration

This spec defines the next milestone for the talking avatar MVP: connecting the frontend UI to the backend audio pipeline. The goal is to enable users to submit a message, receive a generated audio response (via GPT-4o + ElevenLabs), and play it back in the browser.

---

## 🧩 System Overview

**Goal:**
- User submits a message in the frontend UI
- Backend generates a natural language script (ChatGPT/GPT-4o)
- Script is converted to speech using ElevenLabs
- Frontend receives and plays the audio response

**Scope:**
- No video generation yet (audio only)
- End-to-end: UI → backend → audio → UI playback

---

## 🔗 Integration Flow

1. **User** types a message in the frontend and clicks "Send"
2. **Frontend** sends a POST request to `/api/generate/audio` with `{ userMessage: "..." }`
3. **Backend**:
    - Calls GPT-4o to generate a reply script
    - Passes the script to ElevenLabs to generate audio
    - Returns `{ script, audioUrl }` to the frontend
4. **Frontend**:
    - Receives the response
    - Displays the script (optional)
    - Renders an audio player with the audioUrl
    - User can press play to hear the response

---

## 📁 Folder Structure

- `/frontend` — Next.js frontend (UI, API route proxy if needed)
- `/backend/audio/generateScriptAndAudio.js` — Backend logic for script + audio

---

## 🛠️ API Contract

### POST `/api/generate/audio`

**Input:**
```json
{
  "userMessage": "What do you love cooking?"
}
```

**Output:**
```json
{
  "script": "I love making adobo...",
  "audioUrl": "https://yourdomain.com/audio/response.mp3"
}
```

- `script`: The generated reply (text)
- `audioUrl`: Public or proxied URL to the generated audio file

---

## 📝 Tasks

### Frontend
- [ ] Add API call to `/api/generate/audio` on message submit
- [ ] Display the returned script (optional, for debugging/UX)
- [ ] Render an `<audio controls>` element with the returned `audioUrl`
- [ ] Handle loading/error states

### Backend
- [ ] Implement `/api/generate/audio` endpoint (proxy or direct)
- [ ] Call GPT-4o with user message to generate script
- [ ] Pass script to ElevenLabs to generate audio
- [ ] Store/serve audio file and return a public URL
- [ ] Return `{ script, audioUrl }` JSON

---

## ✅ Success Criteria

- Submitting a message in the frontend triggers the backend pipeline
- The user can play back the generated audio response in the browser
- Audio is generated using the specified (or default) ElevenLabs voice
- End-to-end latency ≤15s per response (target)
- Handles errors gracefully (e.g., API failure, audio not available)

---

## 🔚 Notes

- Use placeholders or stubs for any unavailable external assets
- Ensure CORS and file serving are configured for audio playback
- Add `.env` with API keys as needed
- Make each module runnable via `npm run dev` or `node script.js` 