// Cloudflare Worker for Perplexity AI API integration
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain'
        }
      });
    }

    try {
      // Get authorization token
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Missing or invalid Authorization header');
        return new Response('Unauthorized', { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain'
          }
        });
      }

      const apiKey = authHeader.substring(7);
      console.log('API key length:', apiKey.length);
      
      if (apiKey !== env.PERPLEXITY_API_KEY) {
        console.log('CLOUDFLARE PROXY:Invalid API key provided');
        return new Response('Invalid API key', { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain'
          }
        });
      }

      // Parse request body
      const requestBody = await request.json();
      const { prompt, model = 'llama-3.1-sonar-small-128k-online' } = requestBody;

      if (!prompt) {
        console.log('Missing prompt in request body');
        return new Response('Missing prompt', { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain'
          }
        });
      }

      console.log('Processing request with model:', model);
      console.log('Prompt:', prompt);

      // Call Perplexity AI API
      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        })
      });

      if (!perplexityResponse.ok) {
        const errorText = await perplexityResponse.text();
        console.error('Perplexity API error:', perplexityResponse.status, errorText);
        return new Response(`Perplexity API error: ${perplexityResponse.status}`, { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain'
          }
        });
      }

      const perplexityData = await perplexityResponse.json();
      console.log('Perplexity response received');

      // Extract the response content
      const responseContent = perplexityData.choices?.[0]?.message?.content;
      
      if (!responseContent) {
        console.error('No content in Perplexity response:', perplexityData);
        return new Response('Invalid response from Perplexity API', { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain'
          }
        });
      }

      // Return the response
      return new Response(JSON.stringify({
        success: true,
        content: responseContent,
        model: model,
        usage: perplexityData.usage
      }), {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal server error', { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain'
        }
      });
    }
  },
}; 