// Test script for Perplexity AI Worker
// Run with: node test.js

const WORKER_URL = 'https://cogitations-perplexity-ai.cogitations.workers.dev'; // Update with your actual worker URL
const API_TOKEN = process.env.API_AUTH_TOKEN || 'your-api-token-here';

async function testWorker() {
  console.log('🧪 Testing Perplexity AI Worker...\n');

  const testCases = [
    {
      name: 'Business Review Test',
      prompt: 'Business Review Notion',
      model: 'llama-3.1-sonar-small-128k-online'
    },
    {
      name: 'Consumer Review Test',
      prompt: 'Consumer Review iPhone 15',
      model: 'llama-3.1-sonar-small-128k-online'
    },
    {
      name: 'Product Discovery Test',
      prompt: 'Find the latest project management software',
      model: 'llama-3.1-sonar-small-128k-online'
    }
  ];

  for (const testCase of testCases) {
    console.log(`📝 Testing: ${testCase.name}`);
    console.log(`Prompt: ${testCase.prompt}`);
    
    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          prompt: testCase.prompt,
          model: testCase.model
        })
      });

      if (!response.ok) {
        console.log(`❌ Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.log(`Error details: ${errorText}\n`);
        continue;
      }

      const data = await response.json();
      console.log(`✅ Success! Response received.`);
      console.log(`Model: ${data.model}`);
      console.log(`Usage: ${data.usage?.total_tokens || 'N/A'} tokens`);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        console.log(`Content preview: ${content.substring(0, 200)}...`);
      }
      
      console.log('---\n');
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}\n`);
    }
  }

  console.log('🏁 Testing completed!');
}

// Test CORS preflight
async function testCORS() {
  console.log('🔄 Testing CORS preflight...');
  
  try {
    const response = await fetch(WORKER_URL, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });

    if (response.ok) {
      console.log('✅ CORS preflight successful');
      console.log('CORS headers:', {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
      });
    } else {
      console.log(`❌ CORS preflight failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ CORS test failed: ${error.message}`);
  }
  
  console.log('---\n');
}

// Run tests
async function runTests() {
  await testCORS();
  await testWorker();
}

// Check if running directly
if (require.main === module) {
  if (!API_TOKEN || API_TOKEN === 'your-api-token-here') {
    console.log('⚠️  Please set the API_AUTH_TOKEN environment variable or update the script');
    console.log('Example: API_AUTH_TOKEN=your-token node test.js');
    process.exit(1);
  }
  
  runTests().catch(console.error);
}

module.exports = { testWorker, testCORS }; 