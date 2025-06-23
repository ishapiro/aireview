import { useRuntimeConfig } from '#imports'

export function useAI() {
  // Send a prompt to the AI API and return the parsed response
  const sendAIPrompt = async (prompt, model = 'gpt-4-turbo') => {
    const config = useRuntimeConfig()
    try {
      const response = await fetch('https://cogitations-review-ai.cogitations.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.public.cogitationsCloudflareToken}`
        },
        body: JSON.stringify({ prompt, model })
      })
      if (!response.ok) {
        throw new Error('AI service unavailable')
      }
      const aiData = await response.json()
      // Return the markdown content (raw)
      return aiData.choices?.[0]?.message?.content || aiData.content || aiData.text || aiData.response || ''
    } catch (error) {
      console.error('AI API error:', error)
      throw error
    }
  }

  return { sendAIPrompt }
} 