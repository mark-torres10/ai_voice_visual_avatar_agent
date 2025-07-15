#!/usr/bin/env node

import dotenv from 'dotenv';
import { GPT4oService } from './services/gpt4oService.js';
import { ElevenLabsService } from './services/elevenlabsService.js';
import { AudioProcessor } from './utils/audioProcessor.js';

// Load environment variables
dotenv.config();

class AudioGenerator {
  constructor() {
    this.validateEnvironment();
    
    this.gptService = new GPT4oService(
      process.env.OPENAI_API_KEY,
      process.env.OPENAI_ORG_ID
    );
    
    this.elevenLabsService = new ElevenLabsService(
      process.env.ELEVENLABS_API_KEY,
      process.env.DEFAULT_VOICE_ID
    );
    
    this.audioProcessor = new AudioProcessor('public');
  }

  validateEnvironment() {
    const requiredVars = ['OPENAI_API_KEY', 'ELEVENLABS_API_KEY'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  async generateAudioFromQuestion(question) {
    const startTime = Date.now();
    console.log('🎯 Starting audio generation process...');
    console.log(`📝 Question: "${question}"`);

    try {
      // Step 1: Generate script using GPT-4o
      console.log('\n🤖 Generating conversational script with GPT-4o...');
      const script = await this.gptService.generateScript(question);
      console.log(`✅ Generated script: "${script}"`);
      console.log(`📊 Script length: ${script.split(/\s+/).length} words`);

      // Step 2: Convert script to audio using ElevenLabs
      console.log('\n🎤 Converting script to audio with ElevenLabs...');
      const audioBuffer = await this.elevenLabsService.generateAudio(script);
      console.log(`✅ Audio generated: ${audioBuffer.length} bytes`);

      // Step 3: Save audio file with timestamp
      console.log('\n💾 Saving audio file...');
      const audioResult = await this.audioProcessor.saveAudioBuffer(audioBuffer);
      console.log(`✅ Audio saved: ${audioResult.filename}`);
      console.log(`📍 File path: ${audioResult.path}`);
      console.log(`📏 File size: ${(audioResult.size / 1024).toFixed(2)} KB`);

      // Step 4: Estimate duration
      const estimatedDuration = await this.audioProcessor.getAudioDuration(audioBuffer);
      console.log(`⏱️  Estimated duration: ${estimatedDuration} seconds`);

      const totalTime = Date.now() - startTime;
      console.log(`\n🎉 Audio generation completed in ${totalTime}ms`);

      return {
        success: true,
        script: script,
        audioFilename: audioResult.filename,
        audioPath: audioResult.path,
        audioSize: audioResult.size,
        duration: estimatedDuration,
        processingTime: totalTime
      };

    } catch (error) {
      console.error('\n❌ Error during audio generation:', error.message);
      throw error;
    }
  }

  async listRecentAudio() {
    console.log('\n📂 Recent audio files:');
    const audioFiles = await this.audioProcessor.listAudioFiles();
    
    if (audioFiles.length === 0) {
      console.log('   No audio files found.');
      return [];
    }

    audioFiles.slice(0, 5).forEach((file, index) => {
      const status = index === 0 ? '👑 LATEST' : '  ';
      console.log(`   ${status} ${file}`);
    });

    return audioFiles;
  }
}

// Main execution function
async function main() {
  console.log('🔊 AI Avatar Audio Generator');
  console.log('================================\n');

  try {
    const generator = new AudioGenerator();

    // Hardcoded question for testing
    const hardcodedQuestion = "What's your favorite way to spend a relaxing weekend?";
    
    console.log('🧪 Running test with hardcoded question...\n');
    
    const result = await generator.generateAudioFromQuestion(hardcodedQuestion);
    
    console.log('\n📋 Generation Summary:');
    console.log(`   Question: "${hardcodedQuestion}"`);
    console.log(`   Script: "${result.script}"`);
    console.log(`   Audio File: ${result.audioFilename}`);
    console.log(`   Processing Time: ${result.processingTime}ms`);
    
    await generator.listRecentAudio();
    
    console.log('\n✨ Success! Audio file is ready for playback.');
    console.log(`📁 Check the public/ directory for: ${result.audioFilename}`);

  } catch (error) {
    console.error('\n💥 Fatal error:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n🔧 Fix: Please update your .env file with valid API keys:');
      console.log('   OPENAI_API_KEY=sk-your-openai-key');
      console.log('   ELEVENLABS_API_KEY=your-elevenlabs-key');
    }
    
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AudioGenerator };