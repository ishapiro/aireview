<template>
  <div>
    <!-- AI Generation Button -->
    <button
      type="button"
      @click="showAIDialog = true"
      class="btn-secondary flex items-center gap-2"
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
              class="btn-secondary flex items-center gap-2"
            >
              <i class="pi pi-plus"></i>
              Append to Existing
            </button>
            <button
              type="button"
              @click="showRefinePromptInput"
              class="btn-secondary flex items-center gap-2"
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
                class="btn-secondary"
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
            class="btn-secondary"
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
  }
})

const emit = defineEmits(['update:modelValue', 'update:summaryValue', 'ai-generated'])

const config = useRuntimeConfig()

// AI Dialog state
const showAIDialog = ref(false)
const aiPrompt = ref('')
const aiResponse = ref('')
const aiError = ref('')
const isGenerating = ref(false)
const showRefineInput = ref(false)
const refinePrompt = ref('')

// Render AI response preview
const renderedAIResponse = computed(() => {
  return marked(aiResponse.value || '')
})

const generateAIContent = async () => {
  if (!aiPrompt.value.trim() || isGenerating.value) return

  isGenerating.value = true
  aiError.value = ''

  try {
    let prompt = aiPrompt.value
    
    // If summary generation is enabled, modify the prompt
    if (props.generateSummary) {
      prompt = `${aiPrompt.value}\n\nPlease provide both a detailed review content and a brief summary (2-3 sentences) in the following format:\n\nSUMMARY:\n[Your summary here]\n\nCONTENT:\n[Your detailed review content here]`
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
    
    if (props.generateSummary) {
      // Parse the response to extract summary and content
      const summaryMatch = fullResponse.match(/SUMMARY:\s*([\s\S]*?)(?=\n\nCONTENT:|\nCONTENT:|$)/i)
      const contentMatch = fullResponse.match(/CONTENT:\s*([\s\S]*?)$/i)
      
      if (summaryMatch && contentMatch) {
        aiResponse.value = contentMatch[1].trim()
        emit('update:summaryValue', summaryMatch[1].trim())
      } else {
        // Fallback: use the full response as content
        aiResponse.value = fullResponse
      }
    } else {
      aiResponse.value = fullResponse
    }
  } catch (error) {
    console.error('Error generating AI content:', error)
    aiError.value = `Error generating content: ${error.message}`
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
}
</script> 