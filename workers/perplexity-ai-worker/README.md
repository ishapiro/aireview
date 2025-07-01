# Perplexity AI Cloudflare Worker

This Cloudflare Worker acts as a proxy to the Perplexity AI API, providing the same interface as the existing OpenAI worker but using Perplexity's AI models.

## Features

- **Authentication**: Uses Bearer token authentication with Perplexity API key
- **CORS Support**: Handles preflight requests and cross-origin access
- **Error Handling**: Comprehensive error handling and logging
- **Content Filtering**: Includes the same content restriction policies as the OpenAI worker
- **Structured Output**: Maintains the same review format and structure

## Setup

### Prerequisites

1. **Cloudflare Account**: You need a Cloudflare account with Workers enabled
2. **Wrangler CLI**: Install Wrangler CLI for deployment
3. **Perplexity API Key**: Get an API key from [Perplexity AI](https://www.perplexity.ai/)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   # Set your Perplexity AI API key (used for both authentication and API calls)
   wrangler secret put PERPLEXITY_API_KEY
   ```

### Development

Run the worker locally for development:
```bash
npm run dev
```

### Deployment

Deploy to staging:
```bash
npm run deploy:staging
```

Deploy to production:
```bash
npm run deploy:production
```

## API Usage

The worker accepts POST requests with the following structure:

```json
{
  "prompt": "Business Review [Product Name]",
  "model": "llama-3.1-sonar-small-128k-online"
}
```

### Headers Required

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_PERPLEXITY_API_KEY`

### Response Format

The worker returns the same response format as the Perplexity AI API:

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "llama-3.1-sonar-small-128k-online",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Generated content..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  }
}
```

## Available Models

The worker supports all Perplexity AI models. The default model is `llama-3.1-sonar-small-128k-online`.

Common models include:
- `llama-3.1-sonar-small-128k-online` (default)
- `llama-3.1-sonar-medium-128k-online`
- `llama-3.1-sonar-large-128k-online`
- `mixtral-8x7b-instruct`
- `codellama-70b-instruct`

## Content Types Supported

The worker supports the same content types as the OpenAI worker:

1. **Business Review [product name]** - Detailed business-focused product reviews
2. **Consumer Review [product name]** - Consumer-focused product reviews
3. **Compare [product1, product2, ...]** - Product comparisons
4. **Find the latest [product description]** - Product discovery
5. **Update [existing review text]** - Review updates
6. **Reformat [Instructions]** - Content reformatting

## Environment Variables

- `PERPLEXITY_API_KEY`: Your Perplexity AI API key (used for both authentication and API calls)

## Security

- All requests must include a valid Perplexity API key as Bearer token
- CORS is configured to allow cross-origin requests
- API keys are stored as Cloudflare secrets
- Comprehensive logging for debugging and monitoring

## Monitoring

The worker includes extensive logging for:
- Request details (method, URL, headers)
- Authentication status
- API request/response details
- Error conditions

Logs can be viewed in the Cloudflare Workers dashboard.

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check that your PERPLEXITY_API_KEY is correctly set
2. **500 Internal Server Error**: Verify your PERPLEXITY_API_KEY is valid
3. **CORS Errors**: Ensure the worker is properly deployed and accessible

### Debug Mode

The worker logs all requests and responses. Check the Cloudflare Workers dashboard for detailed logs.

## Integration with Existing Code

This worker maintains the same interface as the existing OpenAI worker, so it can be used as a drop-in replacement by simply changing the endpoint URL in your application code. 