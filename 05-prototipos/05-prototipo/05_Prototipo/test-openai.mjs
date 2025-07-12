#!/usr/bin/env node
/**
 * Simple test script to verify OpenAI integration
 * This script tests the OpenAI endpoints to ensure they handle requests correctly
 */

const API_BASE = 'http://localhost:3001';

async function testOpenAIEndpoints() {
  console.log('🧪 Testing OpenAI Integration...\n');

  // Test 1: Health check
  console.log('1. Testing health endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    const data = await response.json();
    console.log('✅ Health check:', data.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: OpenAI models endpoint (replicates the curl command)
  console.log('\n2. Testing OpenAI models endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/openai/models`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Models endpoint working');
      console.log(`   Organization: ${data.organization || 'Not configured'}`);
      console.log(`   Project: ${data.project || 'Not configured'}`);
      console.log(`   Models found: ${data.models?.length || 0}`);
    } else {
      console.log('⚠️  Models endpoint returned error:', data.error);
      console.log(`   Configured: ${data.isConfigured ? 'Yes' : 'No'}`);
    }
  } catch (error) {
    console.log('❌ Models endpoint failed:', error.message);
  }

  // Test 3: OpenAI chat endpoint
  console.log('\n3. Testing OpenAI chat endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hello from Lichtara OS test! This is a test message.',
        model: 'gpt-3.5-turbo'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Chat endpoint working');
      console.log(`   Model used: ${data.model || 'Unknown'}`);
      console.log(`   Response: ${data.reply?.substring(0, 100)}...`);
    } else {
      console.log('⚠️  Chat endpoint returned error:', data.error);
      console.log(`   Configured: ${data.isConfigured ? 'Yes' : 'No'}`);
    }
  } catch (error) {
    console.log('❌ Chat endpoint failed:', error.message);
  }

  // Test 4: Invalid request handling
  console.log('\n4. Testing error handling...');
  try {
    const response = await fetch(`${API_BASE}/api/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // Missing prompt
    });
    
    const data = await response.json();
    
    if (response.status === 400) {
      console.log('✅ Error handling works correctly');
      console.log(`   Error message: ${data.error}`);
    } else {
      console.log('⚠️  Unexpected response for invalid request');
    }
  } catch (error) {
    console.log('❌ Error handling test failed:', error.message);
  }

  console.log('\n🏁 Test completed!');
  console.log('\n📝 Note: For full functionality, configure environment variables:');
  console.log('   OPENAI_API_KEY=your_openai_api_key');
  console.log('   OPENAI_ORGANIZATION=org-m9jz1YWDWF85qr3EFGOuyjQA');
  console.log('   OPENAI_PROJECT=your_project_id');
}

// Run tests if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  testOpenAIEndpoints().catch(console.error);
}

export { testOpenAIEndpoints };