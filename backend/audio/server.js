import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { AudioGenerator } from './generateScriptAndAudio.js';

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

// POST /api/generate/audio
app.post('/api/generate/audio', async (req, res) => {
  const { userMessage } = req.body;
  console.log('--- [AUDIO API] New request received ---');
  console.log(`[AUDIO API] userMessage: ${userMessage}`);
  if (!userMessage || typeof userMessage !== 'string' || userMessage.length < 1 || userMessage.length > 500) {
    console.log('[AUDIO API] Invalid userMessage');
    return res.status(400).json({ error: 'Invalid userMessage' });
  }
  try {
    const generator = new AudioGenerator();
    console.log('[AUDIO API] Step 1: Generating script with GPT-4o...');
    let script, audioResult;
    try {
      const scriptResult = await generator.gptService.generateScript(userMessage);
      script = scriptResult;
      console.log(`[AUDIO API] Step 1 COMPLETE: Script generated: "${script}"`);
    } catch (err) {
      console.error('[AUDIO API] Step 1 ERROR: GPT-4o script generation failed:', err.message);
      return res.status(500).json({ error: 'Script generation failed', details: err.message });
    }
    console.log('[AUDIO API] Step 2: Generating audio with ElevenLabs...');
    try {
      const audioBuffer = await generator.elevenLabsService.generateAudio(script);
      audioResult = await generator.audioProcessor.saveAudioBuffer(audioBuffer);
      console.log(`[AUDIO API] Step 2 COMPLETE: Audio saved as ${audioResult.filename} (${audioResult.size} bytes)`);
    } catch (err) {
      console.error('[AUDIO API] Step 2 ERROR: ElevenLabs audio generation failed:', err.message);
      return res.status(500).json({ error: 'Audio generation failed', details: err.message });
    }
    // Estimate duration
    const estimatedDuration = await generator.audioProcessor.getAudioDuration(Buffer.alloc(audioResult.size));
    const audioUrl = `/audio/${audioResult.filename}`;
    console.log('[AUDIO API] Step 3: Sending response to client.');
    res.json({
      script,
      audioUrl,
      duration: estimatedDuration,
      generationTime: null,
    });
    console.log('--- [AUDIO API] Request complete ---');
  } catch (error) {
    console.error('[AUDIO API] UNEXPECTED ERROR:', error.message);
    res.status(500).json({ error: error.message || 'Audio generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🎤 Audio API server running at http://localhost:${PORT}`);
}); 