#!/usr/bin/env node

/**
 * Basic Usage Example for D-ID Avatar Video Generation
 * 
 * This example demonstrates how to use the D-ID service
 * to generate avatar videos from script and audio.
 */

import dotenv from 'dotenv';
import DidService from '../video/services/didService.js';

// Load environment variables
dotenv.config();

async function basicExample() {
  console.log('🎬 Basic D-ID Avatar Video Generation Example\n');

  try {
    // Initialize the D-ID service
    const didService = new DidService();
    console.log('✅ D-ID Service initialized\n');

    // Example 1: Basic video generation
    console.log('📹 Example 1: Basic Video Generation');
    console.log('----------------------------------------');

    const basicRequest = {
      script: "Hello! Welcome to our AI avatar demonstration. This technology can bring any text to life with realistic facial movements and expressions.",
      audioUrl: "https://d-id-public-bucket.s3.amazonaws.com/sample_audio.wav", // Replace with actual audio URL
      presenterId: null // Use default presenter
    };

    console.log('Request parameters:');
    console.log(`  Script: "${basicRequest.script.substring(0, 50)}..."`);
    console.log(`  Audio URL: ${basicRequest.audioUrl}`);
    console.log(`  Presenter: Default (Alice)\n`);

    console.log('⏳ Generating video... (this may take 30-60 seconds)');

    const result = await didService.generateVideo(basicRequest);

    if (result.success) {
      console.log('🎉 Success! Video generated:');
      console.log(`  Video URL: ${result.data.videoUrl}`);
      console.log(`  Duration: ${result.data.duration} seconds`);
      console.log(`  Task ID: ${result.data.taskId}`);
      console.log(`  Format: ${result.metadata.format} (${result.metadata.resolution})\n`);
    } else {
      console.log('❌ Failed to generate video:');
      console.log(`  Error: ${result.error.message}\n`);
    }

    // Example 2: Using different presenter
    console.log('📹 Example 2: Using Different Presenter');
    console.log('----------------------------------------');

    const customPresenterRequest = {
      script: "Hi there! I'm Amy, and I'll be demonstrating how you can use different avatar presenters for variety in your content.",
      audioUrl: "https://d-id-public-bucket.s3.amazonaws.com/sample_audio.wav", // Replace with actual audio URL
      presenterId: didService.getAvailablePresenters()[1]?.url // Use Amy
    };

    console.log('Request parameters:');
    console.log(`  Script: "${customPresenterRequest.script.substring(0, 50)}..."`);
    console.log(`  Presenter: Amy (Professional)\n`);

    console.log('⏳ Generating video with custom presenter...');

    const customResult = await didService.generateVideo(customPresenterRequest);

    if (customResult.success) {
      console.log('🎉 Success! Custom presenter video generated:');
      console.log(`  Video URL: ${customResult.data.videoUrl}`);
      console.log(`  Duration: ${customResult.data.duration} seconds\n`);
    } else {
      console.log('❌ Failed to generate video:');
      console.log(`  Error: ${customResult.error.message}\n`);
    }

    // Example 3: List available presenters
    console.log('👥 Example 3: Available Presenters');
    console.log('-----------------------------------');

    const presenters = didService.getAvailablePresenters();
    console.log('Available avatar presenters:');
    presenters.forEach((presenter, index) => {
      console.log(`  ${index + 1}. ${presenter.name} (${presenter.id})`);
    });

  } catch (error) {
    console.error('💥 Example failed:', error.message);
    
    if (error.message.includes('DID_API_KEY')) {
      console.log('\n🔧 Setup Required:');
      console.log('  1. Get your D-ID API key from https://studio.d-id.com/');
      console.log('  2. Add it to your .env file: DID_API_KEY=your_key_here');
      console.log('  3. Make sure you have credits in your D-ID account');
    }
  }
}

// Example of making HTTP requests to the API server
async function httpApiExample() {
  console.log('\n🌐 HTTP API Usage Example');
  console.log('==========================\n');

  const serverUrl = 'http://localhost:3001';
  
  try {
    // Check if server is running
    console.log('🔍 Checking server health...');
    const healthResponse = await fetch(`${serverUrl}/health`);
    
    if (!healthResponse.ok) {
      throw new Error('Server is not running. Start it with: npm start');
    }
    
    const health = await healthResponse.json();
    console.log(`✅ Server is running: ${health.service}`);
    console.log(`   D-ID Service Ready: ${health.didServiceReady}\n`);

    // Example API call
    console.log('📡 Making video generation request...');
    
    const apiRequest = {
      script: "This is an example of calling the D-ID service via the HTTP API.",
      audioUrl: "https://d-id-public-bucket.s3.amazonaws.com/sample_audio.wav"
    };

    const response = await fetch(`${serverUrl}/api/generate/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequest)
    });

    const result = await response.json();

    if (result.success) {
      console.log('🎉 API request successful!');
      console.log(`   Video URL: ${result.data.videoUrl}`);
      console.log(`   Task ID: ${result.data.taskId}`);
    } else {
      console.log('❌ API request failed:');
      console.log(`   Error: ${result.error.message}`);
    }

  } catch (error) {
    console.log(`❌ HTTP API example failed: ${error.message}`);
    console.log('\n💡 To run this example:');
    console.log('   1. Start the server: npm start');
    console.log('   2. Run this script: node examples/basicUsage.js');
  }
}

// Main execution
async function main() {
  console.log('🤖 D-ID Avatar Video Generation Examples\n');
  console.log('=' .repeat(50));

  // Run the basic service example
  await basicExample();

  // Run the HTTP API example
  await httpApiExample();

  console.log('\n' + '='.repeat(50));
  console.log('🏁 Examples completed!');
  console.log('\n📚 Next Steps:');
  console.log('   • Integrate with your frontend application');
  console.log('   • Customize presenter selection logic');
  console.log('   • Add error handling and retry logic');
  console.log('   • Implement caching for frequent requests');
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Examples interrupted by user');
  process.exit(0);
});

// Run examples
main().catch(error => {
  console.error('\n💥 Examples failed:', error.message);
  process.exit(1);
});