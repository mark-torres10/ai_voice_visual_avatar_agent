# AI Avatar MVP — v3 Spec: Audio + Photo → D-ID Video

This spec defines the next milestone for the talking avatar MVP: generating a talking-head video using D-ID, given a user photo, a script (text), and an audio file. The user photo is provided as a public asset (e.g., `/public/generic_secretary_stock_image.jpg`), and the backend will use D-ID's API to create a video response.

---

## 🧩 System Overview

**Goal:**
- Given a script (text), an audio file (public URL), and a user photo (public path/URL), generate a talking-head video using D-ID's API.
- Return a public video URL to the frontend for playback.

**Scope:**
- No frontend UI changes required for this milestone (focus on backend integration)
- End-to-end: script + audio + photo → backend → D-ID → video URL

---

## 🔗 Step-by-Step Integration Flow

1. **Frontend** (or integration layer) submits a POST request to `/api/generate/video` with:
    - `script`: The generated reply (text)
    - `audioUrl`: Public URL to the generated audio file
    - `photoUrl`: Public URL/path to the user photo (e.g., `/generic_secretary_stock_image.jpg` on Vercel)
2. **Frontend API Route** (`/frontend/app/api/generate/video/route.ts`):
    - Proxies the request to the backend video service (`/backend/video/generateVideo.js`)
    - Handles authentication, error handling, and response formatting
3. **Backend**:
    - Accepts the request and validates inputs
    - Calls D-ID's `/talks` API with the script, audio, and photo
    - Polls or waits for D-ID to finish video generation
    - Stores or proxies the resulting video file
    - Returns `{ videoUrl }` to the frontend
4. **Frontend**:
    - Receives the `videoUrl` and can render a `<video>` element for playback

---

## 📁 Folder Structure

- `/frontend` — Next.js frontend (UI, API route proxy if needed)
- `/frontend/app/api/generate/video/route.ts` — Serverless function proxy for video generation
- `/backend/video/generateVideo.js` — Backend logic for D-ID video generation
- `/public/generic_secretary_stock_image.jpg` — Default user photo asset (deployed to Vercel)

---

## 🛠️ API Contract

### POST `/api/generate/video`

**Input:**
```json
{
  "script": "I love making adobo...",
  "audioUrl": "https://yourdomain.com/audio/response.mp3",
  "photoUrl": "/generic_secretary_stock_image.jpg"
}
```

**Output:**
```json
{
  "videoUrl": "https://yourdomain.com/video/response.mp4"
}
```

- `videoUrl`: Public or proxied URL to the generated video file

**Notes:**
- If `photoUrl` is not provided, the backend should default to `/generic_secretary_stock_image.jpg`.
- The image must be publicly accessible (e.g., via Vercel `/public` directory).

---

## 📝 Tasks

### Backend
- [ ] Update `/api/generate/video` endpoint to accept and use `photoUrl` as the presenter image.
- [ ] Validate and sanitize `script`, `audioUrl`, and `photoUrl` inputs.
- [ ] Call D-ID `/talks` API with the provided assets.
- [ ] Poll or wait for video generation to complete.
- [ ] Store or serve the resulting video file and return a public URL.
- [ ] Return `{ videoUrl }` JSON.
- [ ] Handle errors and timeouts gracefully.

### Frontend
- [ ] Implement `/app/api/generate/video/route.ts` as a serverless proxy to the backend.
- [ ] Render a `<video controls>` element with the returned `videoUrl` (if not already implemented).
- [ ] Handle loading/error states.

---

## ✅ Success Criteria

- Submitting a script, audio URL, and photo URL triggers D-ID video generation.
- The backend returns a public video URL for playback.
- The video uses the provided photo as the avatar, the script as the transcript, and the audio as the voice.
- End-to-end latency ≤60s per response (target).
- Handles errors gracefully (e.g., D-ID API failure, invalid assets).

---

## 🔚 Notes

- Ensure the photo asset is publicly accessible (e.g., via Vercel `/public` directory as `/generic_secretary_stock_image.jpg`).
- Use placeholders or stubs for any unavailable external assets.
- Add `.env` with D-ID API keys as needed.
- Make each module runnable via `npm run dev` or `node script.js`.
- See D-ID API documentation for required payload structure and polling logic.
- **Vercel Deployment:** The image `/public/generic_secretary_stock_image.jpg` will be available at `https://<your-vercel-domain>/generic_secretary_stock_image.jpg`. 