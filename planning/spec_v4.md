# AI Avatar MVP — v4 Spec: Simplified UI - Textbox to Video

This document outlines a revised specification that simplifies the application architecture by replacing the conversational chat interface with a direct, stateless text-to-video generation flow.

**[2025-07-28] STATUS:** This spec is new and supersedes `specs_v3.md`.

---

## 🧩 System Overview

**Goal:**
- Simplify the user experience by removing the chat interface entirely.
- Provide a single, stateless text input field and a "Generate" button.
- On submission, the application will take the user's text, generate a talking avatar video, and display it.

**Scope:**
- **Frontend:** Major UI simplification. Replace `ChatInterface.tsx` with a new, simple form.
- **Backend:** The core audio and video generation services will remain, but their invocation will be stateless, with no concept of conversation history.
- **Removal:** All components, API routes, and logic related to managing chat threads, message history, and conversational state will be removed.

---

## 🔗 Step-by-Step User Flow

1.  **User Input:** The user visits the main page and is presented with a large textarea and a "Generate Video" button.
2.  **Submission:** The user types a script into the textarea and clicks the button.
3.  **Frontend API Call:** The frontend sends the raw text to a single API endpoint (e.g., `/api/generate`).
4.  **Backend Orchestration:**
    - The API route first calls the audio generation service to create the voice-over from the script.
    - With the resulting audio URL, it then calls the video generation service (D-ID) along with a default photo to create the final video.
5.  **Video Playback:** The API returns the final video URL to the frontend. The frontend then renders this video in a `<video>` player component.

---

## 📁 Folder & Component Structure

-   `/frontend/app/page.tsx`: The main application page. Will be updated to remove `ChatInterface` and instead render a new `SubmissionForm` component and the `VideoPlayer`.
-   `/frontend/components/SubmissionForm.tsx`: **(New)** A new component containing a `<textarea>` and a `<button>` for user input.
-   `/frontend/components/VideoPlayer.tsx`: (Existing) Re-used to display the generated video.
-   `/frontend/components/ChatInterface.tsx`: **(To be removed)** This component and its related sub-components (e.g., `InputArea`) will be deleted.
-   `/frontend/app/api/generate/route.ts`: **(New/Refactored)** A single endpoint to orchestrate the audio and video generation process.

---

## 🛠️ API Contract

### POST `/api/generate`

This single endpoint will handle the entire generation process to simplify the client-side logic.

**Input:**
```json
{
  "script": "This is the text the avatar will say."
}
```

**Responses:**

- **`200 OK`** - Success
  ```json
  {
    "videoUrl": "https://path/to/generated/video.mp4"
  }
  ```

- **`400 Bad Request`** - Client-side error (e.g., invalid input)
  ```json
  {
    "error": {
      "code": "invalid_input",
      "message": "Script cannot be empty."
    }
  }
  ```

- **`401 Unauthorized`** - Authentication failure (e.g., missing or invalid API key)
  ```json
  {
    "error": {
      "code": "unauthorized",
      "message": "Authentication required or invalid credentials."
    }
  }
  ```

- **`403 Forbidden`** - Authorization failure (e.g., insufficient permissions)
  ```json
  {
    "error": {
      "code": "forbidden",
      "message": "You do not have permission to access this resource."
    }
  }
  ```

- **`429 Too Many Requests`** - Rate limit exceeded
  ```json
  {
    "error": {
      "code": "rate_limit_exceeded",
      "message": "Too many requests. Please try again later."
    }
  }
  ```

- **`500 Internal Server Error`** - Server-side error (e.g., upstream service failure)
  ```json
  {
    "error": {
      "code": "video_generation_failed",
      "message": "The video generation service failed to process the request."
    }
  }
  ```

---

## 📝 Tasks

### Frontend
- [ ] Create a new component `SubmissionForm.tsx` with a textarea and a submit button.
- [ ] Update `app/page.tsx` to remove `ChatInterface.tsx` and use `SubmissionForm.tsx`.
- [ ] Implement the client-side logic in `SubmissionForm.tsx` to:
    -   Manage the state of the textarea.
    -   Handle form submission.
    -   Call the `/api/generate` endpoint.
    -   Pass the returned `videoUrl` to the `VideoPlayer` component.
    -   Display loading and error states to the user.
- [ ] Delete `ChatInterface.tsx`, `InputArea.tsx`, and any other related, now unused components.
- [ ] Remove any chat-related tests and update others as needed.

### Backend (API Route)
- [ ] Create a new API route at `/app/api/generate/route.ts`.
- [ ] Implement authentication and rate limiting to protect the endpoint.
- [ ] Implement robust input validation and content moderation for the `script` to ensure safe and valid requests.
- [ ] This route will receive the `script` from the frontend.
- [ ] It will first call the audio generation service (ElevenLabs).
- [ ] Upon receiving the audio URL, it will then call the video generation service (D-ID), passing the audio URL and the default photo URL.
- [ ] Implement a retry/back-off strategy for calls to external services (ElevenLabs, D-ID) to handle throttling and transient errors.
- [ ] Implement structured logging for requests, responses, and errors, including generation duration and failure rates.
- [ ] It will return the final `videoUrl` or an error message.
- [ ] Delete the old, separate API routes for `/api/generate/audio` and `/api/generate/video`.

---

## ✅ Success Criteria

- The application loads to a simple page with a text box and a button, with no chat UI visible.
- Entering text and clicking the button successfully generates a video.
- The generated video is played back on the screen.
- All old chat-related code (components, APIs, tests) has been removed from the codebase.
- The application is stateless from the user's perspective.
