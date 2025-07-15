import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { AudioGenerator } from './generateScriptAndAudio.js';

console.log('[BACKEND] server.js loaded');

const app = express();
const PORT = process.env.PORT || 3001;

// For ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve audio files from ../../public
const publicDir = path.resolve(__dirname, '../../public');
app.use('/audio', express.static(publicDir));

app.post('/api/generate/audio', async (req, res) => {
  console.log('--- [BACKEND API] New request received ---');
  try {
    const { userMessage } = req.body;
    console.log(`[BACKEND API] userMessage: ${userMessage}`);
    if (!userMessage || typeof userMessage !== 'string' || userMessage.length < 1 || userMessage.length > 500) {
      console.error('[BACKEND API] Invalid userMessage');
      return res.status(400).json({ error: 'Invalid userMessage' });
    }
    // Check environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('[BACKEND API] Missing OPENAI_API_KEY');
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
    }
    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('[BACKEND API] Missing ELEVENLABS_API_KEY');
      return res.status(500).json({ error: 'Missing ELEVENLABS_API_KEY' });
    }
    const generator = new AudioGenerator();
    console.log('[BACKEND API] Step 1: Generating script with GPT-4o...');
    let script, audioResult;
    try {
      const scriptResult = await generator.gptService.generateScript(userMessage);
      script = scriptResult;
      console.log(`[BACKEND API] Step 1 COMPLETE: Script generated: "${script}"`);
    } catch (err) {
      console.error('[BACKEND API] Step 1 ERROR: GPT-4o script generation failed:', err.message, err.stack);
      return res.status(500).json({ error: 'Script generation failed', details: err.message });
    }
    console.log('[BACKEND API] Step 2: Generating audio with ElevenLabs...');
    try {
      const audioBuffer = await generator.elevenLabsService.generateAudio(script);
      audioResult = await generator.audioProcessor.saveAudioBuffer(audioBuffer);
      console.log(`[BACKEND API] Step 2 COMPLETE: Audio saved as ${audioResult.filename} (${audioResult.size} bytes)`);
    } catch (err) {
      console.error('[BACKEND API] Step 2 ERROR: ElevenLabs audio generation failed:', err.message, err.stack);
      return res.status(500).json({ error: 'Audio generation failed', details: err.message });
    }
    // Estimate duration
    const estimatedDuration = await generator.audioProcessor.getAudioDuration(Buffer.alloc(audioResult.size));
    const audioUrl = `/audio/${audioResult.filename}`;
    console.log('[BACKEND API] Step 3: Sending response to client.');
    res.json({
      script,
      audioUrl,
      duration: estimatedDuration,
      generationTime: null,
    });
    console.log('--- [BACKEND API] Request complete ---');
  } catch (error) {
    console.error('[BACKEND API] UNEXPECTED ERROR:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'Audio generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`[BACKEND] Audio API server running at http://localhost:${PORT}`);
  const openaiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.slice(0, 6) + '...' : 'MISSING';
  const elevenlabsKey = process.env.ELEVENLABS_API_KEY ? process.env.ELEVENLABS_API_KEY.slice(0, 6) + '...' : 'MISSING';
  console.log(`[BACKEND] OPENAI_API_KEY present: ${!!process.env.OPENAI_API_KEY} (${openaiKey})`);
  console.log(`[BACKEND] ELEVENLABS_API_KEY present: ${!!process.env.ELEVENLABS_API_KEY} (${elevenlabsKey})`);
}); 