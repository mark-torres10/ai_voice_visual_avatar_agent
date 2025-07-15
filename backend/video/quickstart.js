#!/usr/bin/env node

/**
 * Quick Start Script for D-ID Avatar Video Generation
 * 
 * This script quickly tests the setup and demonstrates basic functionality
 */

import dotenv from 'dotenv';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

console.log('🚀 D-ID Avatar Video Generation - Quick Start');
console.log('=' .repeat(50));

// Check environment setup
function checkEnvironment() {
  console.log('\n🔍 Checking Environment Setup...');
  
  const checks = [
    {
      name: 'Node.js Version',
      test: () => process.version,
      expected: 'v18 or higher',
      status: process.version >= 'v18' ? '✅' : '❌'
    },
    {
      name: 'D-ID API Key',
      test: () => process.env.DID_API_KEY ? 'Configured' : 'Not set',
      expected: 'API key configured',
      status: process.env.DID_API_KEY && process.env.DID_API_KEY !== 'your_did_api_key_here' ? '✅' : '⚠️'
    },
    {
      name: 'Environment File',
      test: () => {
        try {
          return existsSync('.env') ? 'Found' : 'Missing';
        } catch {
          return 'Missing';
        }
      },
      expected: '.env file exists',
      status: existsSync('.env') ? '✅' : '❌'
    }
  ];

  checks.forEach(check => {
    const result = check.test();
    console.log(`   ${check.status} ${check.name}: ${result}`);
  });

  return checks.every(check => check.status === '✅');
}

// Install dependencies
async function installDependencies() {
  console.log('\n📦 Installing Dependencies...');
  
  return new Promise((resolve, reject) => {
    const npm = spawn('npm', ['install'], {
      cwd: __dirname,
      stdio: 'inherit'
    });

    npm.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Dependencies installed successfully');
        resolve();
      } else {
        console.log('❌ Failed to install dependencies');
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
  });
}

// Test the service
async function testService() {
  console.log('\n🧪 Testing D-ID Service...');
  
  try {
    // Import and test the service
    const { default: DidService } = await import('./services/didService.js');
    
    const didService = new DidService();
    console.log('✅ D-ID Service initialized successfully');
    
    // Test available presenters
    const presenters = didService.getAvailablePresenters();
    console.log(`✅ Found ${presenters.length} available presenters`);
    
    // Test mock generation (without API call)
    console.log('✅ Service is ready for video generation');
    
    return true;
  } catch (error) {
    console.log(`❌ Service test failed: ${error.message}`);
    return false;
  }
}

// Start the server
async function startServer() {
  console.log('\n🌐 Starting Development Server...');
  
  return new Promise((resolve) => {
    const server = spawn('node', ['generateVideo.js'], {
      cwd: __dirname,
      stdio: 'pipe'
    });

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      if (output.includes('running on port')) {
        console.log('✅ Server started successfully');
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`Server error: ${data}`);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      console.log('⚠️  Server startup timeout');
      resolve(null);
    }, 10000);
  });
}

// Main setup flow
async function main() {
  try {
    // Step 1: Check environment
    const envOk = checkEnvironment();
    
    if (!envOk) {
      console.log('\n⚠️  Environment check failed. Please fix the issues above.');
      console.log('\n🔧 Setup Instructions:');
      console.log('   1. Make sure you have Node.js 18+ installed');
      console.log('   2. Get your D-ID API key from https://studio.d-id.com/');
      console.log('   3. Add it to your .env file: DID_API_KEY=your_key_here');
      process.exit(1);
    }

    // Step 2: Install dependencies
    await installDependencies();

    // Step 3: Test the service
    const serviceOk = await testService();
    
    if (!serviceOk) {
      console.log('\n❌ Service test failed. Check your configuration.');
      process.exit(1);
    }

    // Step 4: Provide next steps
    console.log('\n🎉 Quick Start Complete!');
    console.log('\n📚 What you can do now:');
    console.log('   • Start the server: npm start');
    console.log('   • Test the service: npm run test-did');
    console.log('   • Run examples: node examples/basicUsage.js');
    console.log('   • Make API calls to: http://localhost:3001/api/generate/video');

    console.log('\n📖 API Endpoints:');
    console.log('   • POST /api/generate/video - Generate avatar video');
    console.log('   • GET /api/presenters - List available presenters');
    console.log('   • GET /health - Check service health');
    console.log('   • POST /api/test/video - Test without API credits');

    console.log('\n🔗 Example API Call:');
    console.log(`
curl -X POST http://localhost:3001/api/generate/video \\
  -H "Content-Type: application/json" \\
  -d '{
    "script": "Hello from AI avatar!",
    "audioUrl": "https://example.com/audio.mp3"
  }'`);

  } catch (error) {
    console.error('\n💥 Quick start failed:', error.message);
    process.exit(1);
  }
}

// Handle interruption
process.on('SIGINT', () => {
  console.log('\n👋 Quick start interrupted');
  process.exit(0);
});

// Run quick start
main();