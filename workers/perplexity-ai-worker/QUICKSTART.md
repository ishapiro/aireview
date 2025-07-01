# Quick Start Guide - Perplexity AI Worker

## 🚀 Deploy in 5 Minutes

### 1. Prerequisites
- Cloudflare account with Workers enabled
- Perplexity AI API key
- Wrangler CLI installed (`npm install -g wrangler`)

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Deploy the Worker
```bash
cd workers/perplexity-ai-worker
npm install
./deploy.sh
```

### 4. Set Environment Variables
```bash
# Set authentication token (you'll be prompted for the value)
wrangler secret put API_AUTH_TOKEN

# Set Perplexity API key (you'll be prompted for the value)
wrangler secret put PERPLEXITY_API_KEY
```

### 5. Test the Worker
```bash
# Set your API token and test
API_AUTH_TOKEN=your-token-here node test.js
```

## 🔧 Integration with Your App

### Update your useAI.js composable:

```javascript
// Add a new function for Perplexity AI
const sendPerplexityPrompt = async (prompt, model = 'llama-3.1-sonar-small-128k-online') => {
  const config = useRuntimeConfig()
  try {
    const response = await fetch('https://cogitations-perplexity-ai.cogitations.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.cogitationsCloudflareToken}`
      },
      body: JSON.stringify({ prompt, model })
    })
    if (!response.ok) {
      throw new Error('Perplexity AI service unavailable')
    }
    const aiData = await response.json()
    return aiData.choices?.[0]?.message?.content || ''
  } catch (error) {
    console.error('Perplexity AI API error:', error)
    throw error
  }
}

return { sendAIPrompt, sendPerplexityPrompt }
```

### Usage in your components:

```javascript
const { sendPerplexityPrompt } = useAI()

// Use Perplexity AI instead of OpenAI
const result = await sendPerplexityPrompt('Business Review Notion')
```

## 📊 Available Models

- `llama-3.1-sonar-small-128k-online` (default, fastest)
- `llama-3.1-sonar-medium-128k-online` (balanced)
- `llama-3.1-sonar-large-128k-online` (highest quality)
- `mixtral-8x7b-instruct` (good for coding)
- `codellama-70b-instruct` (specialized for code)

## 🔍 Monitoring

- View logs: https://dash.cloudflare.com/workers
- Monitor usage: https://dash.cloudflare.com/workers/analytics

## 🆘 Troubleshooting

### Common Issues:

1. **401 Unauthorized**: Check your API_AUTH_TOKEN
2. **500 Error**: Verify your PERPLEXITY_API_KEY
3. **CORS Error**: Ensure worker is deployed correctly

### Get Help:
- Check Cloudflare Workers dashboard for logs
- Run the test script: `node test.js`
- Verify environment variables: `wrangler secret list` 