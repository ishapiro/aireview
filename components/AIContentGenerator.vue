<template>
  <div>
    <!-- AI Generation Button -->
    <button
      type="button"
      @click="openAIDialog"
      class="btn-primary flex items-center gap-2"
    >
      <i class="pi pi-robot"></i>
      {{ buttonLabel }}
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
        <!-- Review Type Selection -->
        <div class="bg-gray-100 p-4 rounded-lg mb-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Review Type:
          </label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="reviewType"
                value="consumer"
                class="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                :disabled="isGenerating"
              />
              <span class="text-sm text-gray-700">Consumer Review</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="reviewType"
                value="business"
                class="mr-2 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                :disabled="isGenerating"
              />
              <span class="text-sm text-gray-700">Business Review</span>
            </label>
          </div>
        </div>

        <!-- Prompt Input -->
        <div>
          <label for="ai-prompt" class="block text-sm font-medium text-gray-700 mb-2">
            Enter information about the product(s) you want to review:
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
            :disabled="!aiPrompt.trim() || !reviewType || isGenerating"
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

            <!-- AI Generated Summary -->
            <div v-if="generatedSummary" class="mb-4">
              <h3 class="text-lg font-medium text-gray-900 mb-2">AI Generated Summary:</h3>
              <div class="bg-gray-50 p-4 rounded-lg border">
                <div class="prose prose-sm max-w-none" v-html="renderedGeneratedSummary"></div>
              </div>
            </div>
            
            <h3 class="text-lg font-medium text-gray-900 mb-2">AI Generated Content:</h3>
            <div class="bg-gray-50 p-4 rounded-lg border">
              <div class="prose prose-sm max-w-none" v-html="renderedGeneratedContent"></div>
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
import { useAI } from '@/composables/useAI'

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
  },
  mode: {
    type: String,
    default: 'create' // 'create' or 'edit'
  }
})

const emit = defineEmits(['update:modelValue', 'update:summaryValue', 'update:ratingValue', 'ai-generated'])

const buttonLabel = computed(() => {
  return props.mode === 'edit' ? 'Regenerate with AI' : 'Generate with AI'
})

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
const generatedSummary = ref('')
const generatedContent = ref('')
const reviewType = ref('business')

// Render AI response preview
const renderedAIResponse = computed(() => {
  return marked(aiResponse.value || '')
})

const renderedGeneratedSummary = computed(() => {
  return marked(generatedSummary.value || '')
})

const renderedGeneratedContent = computed(() => {
  return marked(generatedContent.value || '')
})

// Preload prompt with title when dialog opens
const openAIDialog = () => {
  showAIDialog.value = true
  // Preload prompt with title if available
  if (props.title && props.title.trim()) {
    const reviewTypeText = reviewType.value === 'business' ? 'Business Review' : 'Consumer Review'
    aiPrompt.value = `${reviewTypeText}: ${props.title.trim()}\n\n`
  } else {
    aiPrompt.value = ''
  }
}

const { sendAIPrompt } = useAI()

const generateAIContent = async () => {
  if (!aiPrompt.value.trim() || !reviewType.value || isGenerating.value) return

  isGenerating.value = true
  aiError.value = ''

  try {
    // Format the prompt with the selected review type
    const reviewTypeText = reviewType.value === 'business' ? 'Business Review' : 'Consumer Review'
    let prompt = `${reviewTypeText}: ${aiPrompt.value.trim()}\n\n`
    
    // Define the format instructions
    // All instructions are in the cloudflare worker, so we don't need to include them here
    const formatInstructions = ``;
    // Append the instructions to the prompt
    prompt = `${prompt}\n\n${formatInstructions}`;

    // Use shared composable
    const fullResponse = await sendAIPrompt(prompt)
    aiResponse.value = fullResponse.trim()

    // Parse the response to extract rating (now supports decimal ratings)
    const ratingMatch = fullResponse.match(/\*\*Rating: (\d+(?:\.\d+)?)\/5 stars\*\*/)
    if (ratingMatch) {
      suggestedRating.value = parseFloat(ratingMatch[1])
    } else {
      // Try alternative format: RATING: X.X
      const altRatingMatch = fullResponse.match(/RATING:\s*(\d+(?:\.\d+)?)/i)
      if (altRatingMatch) {
        suggestedRating.value = parseFloat(altRatingMatch[1])
        console.log('[AIContentGenerator] Found rating with alt format:', suggestedRating.value)
      }
    }

    // Parse for summary and content
    if (props.generateSummary) {
      const summaryMatch = fullResponse.match(/SUMMARY:\s*([\s\S]*?)(?=\n\nCONTENT:|\nCONTENT:|$)/i)
      if (summaryMatch) {
        generatedSummary.value = summaryMatch[1].trim()
      }
    }
    let content = fullResponse
    // Clean up the content, removing other parts
    content = content.replace(/TITLE:[\s\S]*?\n\n/i, '')
    if (props.generateSummary) {
      content = content.replace(/SUMMARY:[\s\S]*?CONTENT:/i, 'CONTENT:')
    }
    content = content.replace(/CONTENT:\s*/i, '')
    content = content.replace(/\n\n---[\s\S]*/, '').trim()
    generatedContent.value = content
  } catch (error) {
    console.error('Error generating AI content:', error)
    aiError.value = `Error generating content: ${error.message}`
  } finally {
    isGenerating.value = false
  }
}

// New function to generate product lists
const generateProductList = async (categoryName) => {
  if (!categoryName || isGenerating.value) return { products: [], rawResponse: '' }

  isGenerating.value = true
  aiError.value = ''

  try {
    const prompt = `Find the latest ${categoryName}`
    const requestBody = {
      prompt: prompt,
      model: 'gpt-4-turbo'
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
    let parsedProducts = []
    
    if (productsMatch) {
      const productsText = productsMatch[1].trim()
      const productLines = productsText.split('\n').filter(line => line.trim())
      
      parsedProducts = productLines.map(line => {
        // Remove numbering and clean up
        return line.replace(/^\d+\.\s*/, '').trim().replace(/[^\w\s.-]/g, '')
      }).filter(product => /[a-zA-Z0-9]/.test(product))
    } else {
      // Fallback: try to extract products from the response
      const lines = fullResponse.split('\n').filter(line => line.trim())
      parsedProducts = lines
        .map(line => line.replace(/^\d+\.\s*/, '').trim().replace(/[^\w\s.-]/g, ''))
        .filter(product => /[a-zA-Z0-9]/.test(product) && !product.toLowerCase().includes('product'))
        .slice(0, 10)
    }
    
    return { products: parsedProducts, rawResponse: fullResponse }
  } catch (error) {
    console.error('Error generating product list:', error)
    aiError.value = `Error generating product list: ${error.message}`
    return { products: [], rawResponse: error.message }
  } finally {
    isGenerating.value = false
  }
}

// New function to generate product reviews
const generateProductReview = async (productName, categoryName, reviewType = 'business') => {
  if (!productName || isGenerating.value) return null

  isGenerating.value = true
  aiError.value = ''

  console.log(`[AIContentGenerator] Generating review for product:`, productName, 'category:', categoryName, 'reviewType:', reviewType)

  try {
    const reviewTypeText = reviewType === 'consumer' ? 'Consumer Review' : 'Business Review'
    const prompt = `${reviewTypeText}: Review "${productName}"`

    const requestBody = {
      prompt: prompt,
      model: 'gpt-4-turbo'
    }

    console.log('[AIContentGenerator] Sending prompt to AI:', prompt)

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
    
    console.log('[AIContentGenerator] Raw AI response:', fullResponse)

    // Robust title extraction
    let title = null
    // Try to match various title formats
    let titleMatch = fullResponse.match(/(?:\*\*\s*)?TITLE\s*:?\*\*?\s*([\s\S]*?)(?=\n\n|\n|$)/i)
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim()
    }
    // If title is empty or just 'TITLE', 'TITLE:', '**TITLE:**', use productName
    if (!title || /^\**\s*title:?\**$/i.test(title)) {
      title = productName
    }

    const summaryMatch = fullResponse.match(/SUMMARY:\s*([\s\S]*?)(?=\n\nCONTENT:|\nCONTENT:|$)/i)
    const contentMatch = fullResponse.match(/CONTENT:\s*([\s\S]*?)(?=\n\nRATING:|\nRATING:|$)/i)
    const ratingMatch = fullResponse.match(/RATING:\s*(\d+(?:\.\d+)?)/i)
    const categoryMatch = fullResponse.match(/CATEGORY:\s*([\s\S]*?)(?=\n|$)/i)

    const summary = summaryMatch ? summaryMatch[1].trim() : ''
    const content = contentMatch ? contentMatch[1].trim() : fullResponse
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 3
    const category = categoryMatch ? categoryMatch[1].trim() : undefined

    // Truncate title for slug
    const slugBase = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 30)

    const parsedData = {
      title,
      summary,
      content,
      rating: Math.max(1.0, Math.min(5.0, rating)),
      ...(category ? { category } : {}),
      slugBase
    }

    console.log('[AIContentGenerator] Parsed review data:', parsedData)

    return parsedData
  } catch (error) {
    console.error(`[AIContentGenerator] Error generating review for ${productName}:`, error)
    aiError.value = `Error generating review: ${error.message}`
    return null
  } finally {
    isGenerating.value = false
  }
}

const useAIContent = () => {
  console.log('[AIContentGenerator] useAIContent called')
  console.log('[AIContentGenerator] generatedContent:', generatedContent.value)
  console.log('[AIContentGenerator] generatedSummary:', generatedSummary.value)
  console.log('[AIContentGenerator] suggestedRating:', suggestedRating.value)
  
  emit('update:modelValue', generatedContent.value)
  if (props.generateSummary && generatedSummary.value) {
    console.log('[AIContentGenerator] Emitting update:summaryValue:', generatedSummary.value)
    emit('update:summaryValue', generatedSummary.value)
  }
  if (suggestedRating.value) {
    console.log('[AIContentGenerator] Emitting update:ratingValue:', suggestedRating.value)
    emit('update:ratingValue', suggestedRating.value)
  }
  emit('ai-generated')
  closeAIDialog()
}

const appendAIContent = () => {
  const separator = props.modelValue ? '\n\n' : ''
  const newContent = props.modelValue + separator + generatedContent.value
  emit('update:modelValue', newContent)
  emit('ai-generated')
  closeAIDialog()
}

const showRefinePromptInput = () => {
  showRefineInput.value = true
  refinePrompt.value = ''
}

const submitRefinedPrompt = async () => {
  if (!refinePrompt.value.trim() || isGenerating.value) return

  // Combine original prompt with refinement, maintaining the review type
  const reviewTypeText = reviewType.value === 'business' ? 'Business Review' : 'Consumer Review'
  const combinedPrompt = `${reviewTypeText}: ${aiPrompt.value.trim()}\n\nAdditional instructions: ${refinePrompt.value}`
  
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
  generatedSummary.value = ''
  generatedContent.value = ''
  aiError.value = ''
  showRefineInput.value = false
  refinePrompt.value = ''
  suggestedRating.value = null
  reviewType.value = 'business'
}

// Watch for review type changes to update prompt prefix
watch(reviewType, (newType) => {
  if (props.title && props.title.trim() && aiPrompt.value) {
    const reviewTypeText = newType === 'business' ? 'Business Review' : 'Consumer Review'
    // Update the prompt prefix while preserving the user's content
    const userContent = aiPrompt.value.replace(/^(Business Review|Consumer Review):\s*/, '').trim()
    aiPrompt.value = `${reviewTypeText}: ${userContent}`
  }
})

// Expose functions for use by other components
defineExpose({
  generateProductList,
  generateProductReview,
  generateAIContent
})
</script> 