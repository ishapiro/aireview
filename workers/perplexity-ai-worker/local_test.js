const API_KEY = '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';
const url = 'https://api.perplexity.ai/chat/completions';

const system_prompt = `
You are a helpful assistant.
Format the responses as 1. [product], 2. [product], etc.
Provide me a reformatted summary of the reviews for each product.
`

const body = {
  model: 'sonar',
  messages: [
    { role: 'system', content: system_prompt },
    { role: 'user', content: 'Find the latest smartphones in 2025. Include the Apple iPhone' }
  ]
};

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})
  .then(res => res.json())
  .then(data => {
    console.log('=== FULL RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices.length > 0) {
      console.log('\n=== CHOICE DETAILS ===');
      data.choices.forEach((choice, index) => {
        console.log(`\n--- Choice ${index + 1} ---`);
        console.log('Index:', choice.index);
        console.log('Finish Reason:', choice.finish_reason);
        
        if (choice.message) {
          console.log('\n--- Message Object ---');
          console.log('Role:', choice.message.role);
          console.log('Content:', choice.message.content);
        }
        
        if (choice.delta) {
          console.log('\n--- Delta Object ---');
          console.log(JSON.stringify(choice.delta, null, 2));
        }
      });
    }
    
    if (data.citations) {
      console.log('\n=== CITATIONS ===');
      data.citations.forEach((citation, index) => {
        console.log(`${index + 1}. ${citation}`);
      });
    }
    
    if (data.search_results) {
      console.log('\n=== SEARCH RESULTS ===');
      data.search_results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.title}`);
        console.log(`   URL: ${result.url}`);
        console.log(`   Date: ${result.date}`);
        console.log(`   Last Updated: ${result.last_updated || 'N/A'}`);
        console.log('');
      });
    }
    
    if (data.usage) {
      console.log('\n=== USAGE STATS ===');
      console.log('Prompt Tokens:', data.usage.prompt_tokens);
      console.log('Completion Tokens:', data.usage.completion_tokens);
      console.log('Total Tokens:', data.usage.total_tokens);
      if (data.usage.search_context_size) {
        console.log('Search Context Size:', data.usage.search_context_size);
      }
    }
  })
  .catch(err => console.error(err));
