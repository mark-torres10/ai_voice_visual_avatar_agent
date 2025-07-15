import fetch from 'node-fetch';

const VOICE_CONFIG = {
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // Default: Bella (warm, friendly)
  modelId: 'eleven_multilingual_v2',
  voiceSettings: {
    stability: 0.5,        // Consistent but not robotic
    similarity_boost: 0.8,  // Close to original voice
    style: 0.2,           // Slight style variation
    use_speaker_boost: true
  }
};

export class ElevenLabsService {
  constructor(apiKey, defaultVoiceId = null) {
    if (!apiKey || apiKey.length !== 32) {
      throw new Error('Invalid ElevenLabs API key format');
    }
    
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.elevenlabs.io/v1';
    this.defaultVoiceId = defaultVoiceId || VOICE_CONFIG.voiceId;
  }

  async generateAudio(script, voiceId = null) {
    const targetVoiceId = voiceId || this.defaultVoiceId;
    
    try {
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${targetVoiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
          },
          body: JSON.stringify({
            text: script,
            model_id: VOICE_CONFIG.modelId,
            voice_settings: VOICE_CONFIG.voiceSettings
          })
        }
      );

      if (!response.ok) {
        await this.handleApiError(response);
      }

      const audioBuffer = await response.arrayBuffer();
      return Buffer.from(audioBuffer);
    } catch (error) {
      if (error.message.includes('rate limit')) {
        throw new Error('ElevenLabs rate limit exceeded');
      }
      if (error.message.includes('401')) {
        throw new Error('Invalid ElevenLabs API key');
      }
      if (error.message.includes('400')) {
        throw new Error('Invalid script for TTS conversion');
      }
      throw new Error(`TTS conversion failed: ${error.message}`);
    }
  }

  async handleApiError(response) {
    const errorText = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.detail) {
        errorMessage += ` - ${errorData.detail}`;
      }
    } catch (e) {
      // Fallback to raw text
      errorMessage += ` - ${errorText}`;
    }
    
    throw new Error(errorMessage);
  }

  validateApiKey() {
    return this.apiKey && this.apiKey.length === 32;
  }
}