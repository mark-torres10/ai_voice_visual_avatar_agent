#!/usr/bin/env node

import dotenv from 'dotenv';
import DidService from './video/services/didService.js';

// Load environment variables
dotenv.config();

/**
 * Test script for D-ID service
 * This script demonstrates how to use the D-ID service to generate videos
 */

async function testDidService() {
  console.log('🧪 Testing D-ID Service...\n');

  try {
    // Initialize the service
    const didService = new DidService();
    console.log('✅ D-ID Service initialized successfully\n');

    // Test data - you can replace these with real URLs when testing
    const testData = {
      script: "Hello! I'm excited to demonstrate this AI avatar technology. This is a test of the D-ID video generation system.",
      audioUrl: 'https://d-id-public-bucket.s3.amazonaws.com/sample_audio.wav', // Replace with real audio URL
      presenterId: null // Will use default presenter
    };

    console.log('🎬 Test Parameters:');
    console.log(`   Script: "${testData.script}"`);
    console.log(`   Audio URL: ${testData.audioUrl}`);
    console.log(`   Presenter: ${testData.presenterId || 'Default (Alice)'}\n`);

    // Check available presenters
    console.log('👥 Available Presenters:');
    const presenters = didService.getAvailablePresenters();
    presenters.forEach(presenter => {
      console.log(`   - ${presenter.name} (${presenter.id})`);
    });
    console.log('');

    // Generate video
    console.log('🎥 Starting video generation...');
    console.log('   (This may take 30-60 seconds)\n');

    const result = await didService.generateVideo(testData);

    if (result.success) {
      console.log('🎉 Video generation successful!');
      console.log('📊 Results:');
      console.log(`   Task ID: ${result.data.taskId}`);
      console.log(`   Status: ${result.data.status}`);
      console.log(`   Video URL: ${result.data.videoUrl}`);
      console.log(`   Duration: ${result.data.duration} seconds`);
      console.log(`   Created: ${result.data.createdAt}`);
      console.log('\n📋 Metadata:');
      console.log(`   Presenter: ${result.metadata.presenterId}`);
      console.log(`   Resolution: ${result.metadata.resolution}`);
      console.log(`   Format: ${result.metadata.format}`);
    } else {
      console.error('❌ Video generation failed:');
      console.error(`   Error Code: ${result.error.code}`);
      console.error(`   Error Message: ${result.error.message}`);
    }

  } catch (error) {
    console.error('💥 Test failed with error:');
    console.error(`   ${error.message}`);
    
    if (error.message.includes('DID_API_KEY')) {
      console.log('\n🔧 Setup Instructions:');
      console.log('   1. Get your D-ID API key from https://studio.d-id.com/');
      console.log('   2. Add it to your .env file: DID_API_KEY=your_key_here');
      console.log('   3. Make sure you have sufficient credits in your D-ID account');
    }
  }
}

// Test individual methods
async function testMethods() {
  console.log('\n🔧 Testing individual methods...\n');

  try {
    const didService = new DidService();

    // Test error handling with invalid data
    console.log('🚨 Testing error handling...');
    const invalidResult = await didService.generateVideo({
      script: '',
      audioUrl: 'invalid-url',
      presenterId: null
    });

    if (!invalidResult.success) {
      console.log('✅ Error handling working correctly');
      console.log(`   Error: ${invalidResult.error.message}`);
    }

  } catch (error) {
    console.log('✅ Exception handling working correctly');
    console.log(`   Caught error: ${error.message}`);
  }
}

// Run tests
async function main() {
  console.log('🤖 D-ID Avatar Video Generation Test\n');
  console.log('=' .repeat(50));

  // Check if API key is configured
  if (!process.env.DID_API_KEY || process.env.DID_API_KEY === 'your_did_api_key_here') {
    console.log('⚠️  D-ID API key not configured.');
    console.log('   This will run without making actual API calls.\n');
  }

  await testDidService();
  await testMethods();

  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Start the server: npm start');
  console.log('   2. Test the API: POST http://localhost:3001/api/generate/video');
  console.log('   3. Check health: GET http://localhost:3001/health');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Test interrupted by user');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught exception:', error.message);
  process.exit(1);
});

// Run the test
main().catch(error => {
  console.error('\n💥 Test failed:', error.message);
  process.exit(1);
});