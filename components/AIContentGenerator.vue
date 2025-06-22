<template>
  <div>
    <!-- AI Generation Button -->
    <button
      type="button"
      @click="openAIDialog"
      class="btn-primary flex items-center gap-2"
    >
      <i class="pi pi-robot"></i>
      Generate with AI
    </button>

    <!-- AI Dialog -->
    <Dialog
      v-model:visible="showAIDialog"
      modal
      header="AI Content Generation"
      :style="{ width: '80vw', maxWidth: '800px' }"
      :closable="!isGenerating"
    >
      <div class="space-y-4">
        <!-- Prompt Input -->
        <div>
          <label for="ai-prompt" class="block text-sm font-medium text-gray-700 mb-2">
            Enter your prompt for AI content generation:
          </label>
          <textarea
            id="ai-prompt"
            v-model="aiPrompt"
            rows="4"
            class="input-field w-full"
            placeholder="Describe what kind of review content you want to generate..."
            :disabled="isGenerating"
          ></textarea>
        </div>

        <!-- Generate Button -->
        <div class="flex justify-end">
          <button
            type="button"
            @click="generateAIContent"
            class="btn-primary flex items-center gap-2"
            :disabled="!aiPrompt.trim() || isGenerating"
          >
            <i v-if="isGenerating" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-send"></i>
            {{ isGenerating ? 'Generating...' : 'Generate Content' }}
          </button>
        </div>

        <!-- AI Response -->
        <div v-if="aiResponse" class="space-y-4">
          <div class="border-t pt-4">
            <!-- Suggested Rating Display -->
            <div v-if="suggestedRating" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 class="text-sm font-medium text-blue-900 mb-2">Suggested Rating:</h4>
              <div class="flex items-center space-x-1">
                <i 
                  v-for="star in 5" 
                  :key="star"
                  class="text-xl"
                  :class="star <= suggestedRating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  <i class="pi pi-star-fill"></i>
                </i>
                <span class="ml-2 text-sm text-blue-700">({{ suggestedRating }}/5)</span>
              </div>
            </div>
            
            <h3 class="text-lg font-medium text-gray-900 mb-2">AI Generated Content:</h3>
            <div class="bg-gray-50 p-4 rounded-lg border">
              <div class="prose prose-sm max-w-none">
                <div v-html="renderedAIResponse"></div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              type="button"
              @click="useAIContent"
              class="btn-primary flex items-center gap-2"
            >
              <i class="pi pi-check"></i>
              Use This Content
            </button>
            <button
              type="button"
              @click="appendAIContent"
              class="btn-primary flex items-center gap-2"
            >
              <i class="pi pi-plus"></i>
              Append to Existing
            </button>
            <button
              type="button"
              @click="showRefinePromptInput"
              class="btn-primary flex items-center gap-2"
            >
              <i class="pi pi-refresh"></i>
              Refine Prompt
            </button>
          </div>

          <!-- Refine Prompt Input (shown when refining) -->
          <div v-if="showRefineInput" class="space-y-2">
            <label for="refine-prompt" class="block text-sm font-medium text-gray-700">
              Add to or modify your prompt:
            </label>
            <textarea
              id="refine-prompt"
              v-model="refinePrompt"
              rows="3"
              class="input-field w-full"
              placeholder="Add additional instructions or modify the prompt..."
            ></textarea>
            <div class="flex gap-2">
              <button
                type="button"
                @click="submitRefinedPrompt"
                class="btn-primary flex items-center gap-2"
                :disabled="!refinePrompt.trim() || isGenerating"
              >
                <i v-if="isGenerating" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-send"></i>
                {{ isGenerating ? 'Generating...' : 'Submit Refined Prompt' }}
              </button>
              <button
                type="button"
                @click="showRefineInput = false"
                class="btn-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="aiError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ aiError }}
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="closeAIDialog"
            class="btn-primary"
            :disabled="isGenerating"
          >
            Close
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { marked } from 'marked'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  summaryValue: {
    type: String,
    default: ''
  },
  generateSummary: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  ratingValue: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'update:summaryValue', 'update:ratingValue', 'ai-generated'])

const config = useRuntimeConfig()

// AI Dialog state
const showAIDialog = ref(false)
const aiPrompt = ref('')
const aiResponse = ref('')
const aiError = ref('')
const isGenerating = ref(false)
const showRefineInput = ref(false)
const refinePrompt = ref('')
const suggestedRating = ref(null)

// Render AI response preview
const renderedAIResponse = computed(() => {
  return marked(aiResponse.value || '')
})

// Preload prompt with title when dialog opens
const openAIDialog = () => {
  showAIDialog.value = true
  // Preload prompt with title if available
  if (props.title && props.title.trim()) {
    aiPrompt.value = `Review: ${props.title.trim()}\n\n`
  } else {
    aiPrompt.value = ''
  }
}

const generateAIContent = async () => {
  if (!aiPrompt.value.trim() || isGenerating.value) return

  isGenerating.value = true
  aiError.value = ''

  try {
    let prompt = aiPrompt.value
    
    // Add rating instruction to the prompt
    prompt = `${prompt}`;
    
    // If summary generation is enabled, modify the prompt
    if (props.generateSummary) {
      prompt = `${prompt}\n\nPlease provide the review in the following format:\n\nSUMMARY:\n[Your summary here]\n\nCONTENT:\n[Your detailed review content here]\n\n---\n**Rating: [X]/5 stars**\n\n*Reasoning: [Brief explanation of why this rating was given]*`
    } else {
      prompt = `${prompt}\n\nPlease provide the review in the following format:\n\nCONTENT:\n[Your detailed review content here]\n\n---\n**Rating: [X]/5 stars**\n\n*Reasoning: [Brief explanation of why this rating was given]*`
    }

    const requestBody = {
      prompt: prompt,
      model: 'gpt-3.5-turbo'
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    const response = await fetch('https://cogitations-review-ai.cogitations.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.cogitationsCloudflareToken}`
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      throw new Error('AI content generation request failed')
    }

    const data = await response.json()
    console.log('Response data:', JSON.stringify(data, null, 2))
    
    // Extract content from OpenAI API response structure
    const fullResponse = data.choices?.[0]?.message?.content || data.content || data.text || data.response || JSON.stringify(data)
    
    // Parse the response to extract rating, summary, and content
    const ratingMatch = fullResponse.match(/RATING:\s*(\d+)/i)
    const summaryMatch = fullResponse.match(/SUMMARY:\s*([\s\S]*?)(?=\n\nCONTENT:|\nCONTENT:|$)/i)
    const contentMatch = fullResponse.match(/CONTENT:\s*([\s\S]*?)$/i)
    
    // Extract rating
    if (ratingMatch) {
      const rating = parseInt(ratingMatch[1])
      if (rating >= 1 && rating <= 5) {
        suggestedRating.value = rating
        emit('update:ratingValue', rating)
      }
    }
    
    if (props.generateSummary) {
      // Parse the response to extract summary and content
      if (summaryMatch && contentMatch) {
        aiResponse.value = contentMatch[1].trim()
        emit('update:summaryValue', summaryMatch[1].trim())
      } else {
        // Fallback: use the full response as content
        aiResponse.value = fullResponse
      }
    } else {
      // For non-summary mode, extract content after rating
      if (contentMatch) {
        aiResponse.value = contentMatch[1].trim()
      } else {
        // Fallback: use the full response as content
        aiResponse.value = fullResponse
      }
    }
  } catch (error) {
    console.error('Error generating AI content:', error)
    aiError.value = `Error generating content: ${error.message}`
  } finally {
    isGenerating.value = false
  }
}

// New function to generate product lists
const generateProductList = async (categoryName) => {
  if (!categoryName || isGenerating.value) return []

  isGenerating.value = true
  aiError.value = ''

  try {
    const prompt = `Generate a list of 10 popular products in the "${categoryName}" category. 

Please return the list in the following exact format:

PRODUCTS:
1. [Product Name 1]
2. [Product Name 2]
3. [Product Name 3]
...and so on

Only include the product names, no descriptions or additional text.`

    const requestBody = {
      prompt: prompt,
      model: 'gpt-3.5-turbo'
    }

    const response = await fetch('https://cogitations-review-ai.cogitations.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.cogitationsCloudflareToken}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error('Failed to generate product list')
    }

    const data = await response.json()
    const fullResponse = data.choices?.[0]?.message?.content || data.content || data.text || data.response || JSON.stringify(data)
    
    // Parse the product list
    const productsMatch = fullResponse.match(/PRODUCTS:\s*([\s\S]*?)(?=\n\n|$)/i)
    if (productsMatch) {
      const productsText = productsMatch[1].trim()
      const productLines = productsText.split('\n').filter(line => line.trim())
      
      return productLines.map(line => {
        // Remove numbering and clean up
        return line.replace(/^\d+\.\s*/, '').trim().replace(/[^\w\s.-]/g, '')
      }).filter(product => /[a-zA-Z0-9]/.test(product))
    } else {
      // Fallback: try to extract products from the response
      const lines = fullResponse.split('\n').filter(line => line.trim())
      return lines
        .map(line => line.replace(/^\d+\.\s*/, '').trim().replace(/[^\w\s.-]/g, ''))
        .filter(product => /[a-zA-Z0-9]/.test(product) && !product.toLowerCase().includes('product'))
        .slice(0, 10)
    }
  } catch (error) {
    console.error('Error generating product list:', error)
    aiError.value = `Error generating product list: ${error.message}`
    return []
  } finally {
    isGenerating.value = false
  }
}

// New function to generate product reviews
const generateProductReview = async (productName, categoryName) => {
  if (!productName || !categoryName || isGenerating.value) return null

  isGenerating.value = true
  aiError.value = ''

  try {
    const prompt = `Write a detailed, honest review for the product "${productName}" in the "${categoryName}" category.

Please provide the review in the following format:

TITLE:
${productName}

SUMMARY:
[Brief summary of the product and overall impression]

CONTENT:
[Detailed review content with pros and cons, features, performance, value for money, etc.]

RATING:
[Number between 1-5]

REASONING:
[Brief explanation of why this rating was given]

SUGGESTED CATEGORY:
[The most appropriate category for this product, e.g., "Project Management Software"]`

    const requestBody = {
      prompt: prompt,
      model: 'gpt-3.5-turbo'
    }

    const response = await fetch('https://cogitations-review-ai.cogitations.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.cogitationsCloudflareToken}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error('Failed to generate review')
    }

    const data = await response.json()
    const fullResponse = data.choices?.[0]?.message?.content || data.content || data.text || data.response || JSON.stringify(data)
    
    // Parse the review
    const titleMatch = fullResponse.match(/TITLE:\s*([\s\S]*?)(?=\n\nSUMMARY:|\nSUMMARY:|$)/i)
    const summaryMatch = fullResponse.match(/SUMMARY:\s*([\s\S]*?)(?=\n\nCONTENT:|\nCONTENT:|$)/i)
    const contentMatch = fullResponse.match(/CONTENT:\s*([\s\S]*?)(?=\n\nRATING:|\nRATING:|$)/i)
    const ratingMatch = fullResponse.match(/RATING:\s*(\d+)/i)
    const reasoningMatch = fullResponse.match(/REASONING:\s*([\s\S]*?)(?=\n\nSUGGESTED CATEGORY:|\nSUGGESTED CATEGORY:|$)/i)
    const categoryMatch = fullResponse.match(/SUGGESTED CATEGORY:\s*([\s\S]*?)$/i)

    const title = titleMatch ? titleMatch[1].trim() : productName
    const summary = summaryMatch ? summaryMatch[1].trim() : ''
    const content = contentMatch ? contentMatch[1].trim() : fullResponse
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 3
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : ''
    const suggestedCategory = categoryMatch ? categoryMatch[1].trim().replace(/[^\w\s.-]/g, '') : null

    return {
      title,
      summary,
      content: content + (reasoning ? `\n\n**Reasoning:** ${reasoning}` : ''),
      rating: Math.max(1, Math.min(5, rating)),
      suggestedCategory
    }
  } catch (error) {
    console.error(`Error generating review for ${productName}:`, error)
    aiError.value = `Error generating review: ${error.message}`
    return null
  } finally {
    isGenerating.value = false
  }
}

const useAIContent = () => {
  emit('update:modelValue', aiResponse.value)
  emit('ai-generated', true)
  closeAIDialog()
}

const appendAIContent = () => {
  const separator = props.modelValue ? '\n\n' : ''
  const newContent = props.modelValue + separator + aiResponse.value
  emit('update:modelValue', newContent)
  emit('ai-generated', true)
  closeAIDialog()
}

const showRefinePromptInput = () => {
  showRefineInput.value = true
  refinePrompt.value = ''
}

const submitRefinedPrompt = async () => {
  if (!refinePrompt.value.trim() || isGenerating.value) return

  // Combine original prompt with refinement
  const combinedPrompt = `${aiPrompt.value}\n\nAdditional instructions: ${refinePrompt.value}`
  
  // Update the prompt and generate new content
  aiPrompt.value = combinedPrompt
  showRefineInput.value = false
  refinePrompt.value = ''
  
  await generateAIContent()
}

const closeAIDialog = () => {
  showAIDialog.value = false
  aiPrompt.value = ''
  aiResponse.value = ''
  aiError.value = ''
  showRefineInput.value = false
  refinePrompt.value = ''
  suggestedRating.value = null
}

// Expose functions for use by other components
defineExpose({
  generateProductList,
  generateProductReview,
  generateAIContent
})
</script> 