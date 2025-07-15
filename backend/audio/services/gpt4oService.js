import { OpenAI } from 'openai';

const GPT_CONFIG = {
  model: 'gpt-4o-mini',
  maxTokens: 150,
  temperature: 0.7,
  presencePenalty: 0.1,
  frequencyPenalty: 0.1
};

const SYSTEM_PROMPT = `You are a friendly, conversational AI avatar. 
Generate natural, engaging responses that sound authentic when spoken aloud.
- Keep responses 1-3 sentences
- Use conversational tone with natural pauses
- Avoid complex technical jargon
- Include subtle emotional expressions
- Length: 20-100 words maximum`;

export class GPT4oService {
  constructor(apiKey, organizationId = null) {
    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey,
      organization: organizationId
    });
  }

  async generateScript(userMessage) {
    try {
      const response = await this.openai.chat.completions.create({
        model: GPT_CONFIG.model,
        max_tokens: GPT_CONFIG.maxTokens,
        temperature: GPT_CONFIG.temperature,
        presence_penalty: GPT_CONFIG.presencePenalty,
        frequency_penalty: GPT_CONFIG.frequencyPenalty,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      const script = response.choices[0].message.content.trim();
      return this.validateScriptQuality(script);
    } catch (error) {
      if (error.code === 'rate_limit_exceeded') {
        throw new Error('GPT-4o rate limit exceeded');
      }
      if (error.code === 'insufficient_quota') {
        throw new Error('GPT-4o quota exhausted');
      }
      throw new Error(`Failed to generate script: ${error.message}`);
    }
  }

  validateScriptQuality(script) {
    const wordCount = script.split(/\s+/).length;
    
    if (wordCount < 5) {
      throw new Error('Generated script too short');
    }
    
    if (wordCount > 100) {
      // Truncate if too long
      const words = script.split(/\s+/);
      script = words.slice(0, 100).join(' ');
    }
    
    return script;
  }
}