<template>
  <div>
    <!-- Button to trigger the dialog -->
    <Button 
      @click="openDialog" 
      label="Automated AI Reviews for my Business" 
      size="large" 
    />

    <!-- Review Generator Dialog -->
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Generate AI Reviews for your Business"
      :style="{ width: '90vw', maxWidth: '1000px' }"
      :closable="!isProcessing"
    >
      <div class="space-y-6">
        <!-- Step 1: Business Type Input -->
        <div v-if="currentStep === 1">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 1: Describe your business or product needs</h3>
          <div class="space-y-4">
            <div>
              <label for="business-type" class="block text-sm font-medium text-gray-700 mb-2">
                Business Type or Need:
              </label>
              <InputText
                id="business-type"
                v-model="businessType"
                class="w-full"
                placeholder="e.g., 'Coffee Shop in a college town', 'Project management for a small team'"
                :disabled="isProcessing"
              />
            </div>
            <div class="flex justify-end">
              <Button
                @click="generateProductList"
                :loading="isGeneratingProducts"
                :disabled="!businessType.trim()"
                label="Find Products"
                icon="pi pi-arrow-right"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Review Generation -->
        <div v-if="currentStep === 2">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 2: Generating Reviews</h3>
          <div class="space-y-4">
            <!-- Product List Display -->
            <div v-if="products.length > 0" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Found Products:</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div v-for="(product, index) in products" :key="index" class="text-sm text-gray-700 flex items-center">
                  <i class="pi pi-check-circle text-green-500 mr-2"></i>
                  {{ product }}
                </div>
              </div>
            </div>

            <!-- Progress -->
            <div v-if="isProcessing" class="space-y-2">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Processing: {{ currentProductIndex + 1 }} of {{ products.length }}</span>
                <span>{{ Math.round(((currentProductIndex + 1) / products.length) * 100) }}%</span>
              </div>
              <ProgressBar :value="((currentProductIndex + 1) / products.length) * 100" />
              <p class="text-sm text-gray-600">
                Currently processing: <strong>{{ products[currentProductIndex] }}</strong>
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center">
              <Button
                @click="startReviewGeneration"
                :loading="isProcessing"
                :disabled="isProcessing || products.length === 0"
                label="Start Generating Reviews"
                icon="pi pi-play"
              />
              <Button
                @click="currentStep = 1"
                :disabled="isProcessing"
                label="Back"
                icon="pi pi-arrow-left"
              />
            </div>
          </div>
        </div>

        <!-- Step 3: Completion -->
        <div v-if="currentStep === 3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 3: Complete</h3>
          <div class="space-y-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <i class="pi pi-check-circle text-green-500 text-xl mr-3"></i>
                <div>
                  <h4 class="text-sm font-medium text-green-900">Review Generation Complete!</h4>
                  <p class="text-sm text-green-700 mt-1">
                    Successfully processed {{ products.length }} products.
                  </p>
                </div>
              </div>
            </div>

            <!-- Generated Reviews Summary -->
            <div v-if="generatedReviews.length > 0" class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900">Your Generated Reviews:</h4>
              <p class="text-sm text-gray-600">This list has been saved to your browser. You can access it later from your profile page.</p>
              <div class="max-h-60 overflow-y-auto space-y-2">
                <div v-for="review in generatedReviews" :key="review.id" class="bg-white border border-gray-200 rounded p-3">
                  <div class="flex justify-between items-start">
                    <NuxtLink :to="`/reviews/${review.slug}`" class="flex-1">
                      <h5 class="text-sm font-medium text-primary-600 hover:underline">{{ review.title }}</h5>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <Button @click="closeDialog" label="Close" icon="pi pi-check" />
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
      </div>
    </Dialog>

    <!-- Hidden AI Content Generator for reusing AI functions -->
    <AIContentGenerator ref="aiGenerator" style="display: none;" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const client = useSupabaseClient()
const user = useSupabaseUser()

// Dialog state
const showDialog = ref(false)
const currentStep = ref(1)
const isProcessing = ref(false)
const error = ref('')

// User Input
const businessType = ref('')

// Product generation state
const products = ref([])
const isGeneratingProducts = ref(false)

// Review generation state
const currentProductIndex = ref(0)
const generatedReviews = ref([])

// AI Generator reference
const aiGenerator = ref(null)

const openDialog = () => {
  if (!user.value) {
    navigateTo('/auth/login')
    return
  }
  showDialog.value = true
  resetState()
}

const resetState = () => {
  currentStep.value = 1
  businessType.value = ''
  products.value = []
  generatedReviews.value = []
  currentProductIndex.value = 0
  error.value = ''
  isProcessing.value = false
  isGeneratingProducts.value = false
}

const closeDialog = () => {
  showDialog.value = false
  resetState()
}

const generateSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const generateProductList = async () => {
  if (!businessType.value.trim()) return

  isGeneratingProducts.value = true
  error.value = ''

  try {
    const productList = await aiGenerator.value.generateProductList(businessType.value)
    
    if (productList && productList.length > 0) {
      products.value = productList
      currentStep.value = 2
    } else {
      throw new Error('No products could be generated')
    }
  } catch (err) {
    error.value = `Error generating product list: ${err.message}`
  } finally {
    isGeneratingProducts.value = false
  }
}

const startReviewGeneration = async () => {
  if (products.value.length === 0) return

  isProcessing.value = true
  error.value = ''
  generatedReviews.value = []

  let finalReviewList = []

  for (let i = 0; i < products.value.length; i++) {
    currentProductIndex.value = i
    const currentProduct = products.value[i]

    try {
      const { data: existingReview, error: checkError } = await client
        .from('reviews')
        .select('id, title, slug')
        .ilike('title', `%${currentProduct.trim()}%`)
        .maybeSingle()

      if (checkError) {
        throw checkError
      }

      if (existingReview) {
        finalReviewList.push({ id: existingReview.id, title: existingReview.title, slug: existingReview.slug })
        continue
      }

      const reviewData = await aiGenerator.value.generateProductReview(currentProduct, businessType.value)
      
      if (reviewData) {
        // Find category ID
        let categoryIds = []
        if (reviewData.suggestedCategory) {
          const { data: foundCategory, error: categoryError } = await client
            .from('categories')
            .select('id')
            .ilike('name', `%${reviewData.suggestedCategory.trim()}%`)
            .maybeSingle()
          
          if (categoryError) {
            console.error('Error finding category:', categoryError)
          } else if (foundCategory) {
            categoryIds.push(foundCategory.id)
          }
        }
        
        const { data: newReview, error: createError } = await client.rpc('create_review_with_categories', {
          new_title: reviewData.title,
          new_summary: reviewData.summary,
          new_content: reviewData.content,
          new_rating: reviewData.rating,
          new_is_published: true, // Save as published
          new_ai_generated: true,
          new_category_ids: categoryIds,
          author_id: user.value.id
        })

        if (createError) throw createError
        
        // We need slug for the link, but RPC only returns ID. Let's fetch it.
        const { data: finalReview } = await client.from('reviews').select('id, title, slug').eq('id', newReview).single()

        if (finalReview) {
          finalReviewList.push(finalReview)
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      console.error(`Error processing product ${currentProduct}:`, err)
    }
  }
  
  generatedReviews.value = finalReviewList
  saveToLocalStorage(finalReviewList)

  currentStep.value = 3
  isProcessing.value = false
}

const saveToLocalStorage = (reviews) => {
  if (!user.value) return
  const storageKey = `user-generated-reviews-${user.value.id}`
  let existingLists = JSON.parse(localStorage.getItem(storageKey) || '[]')
  
  const newList = {
    id: Date.now(),
    date: new Date().toISOString(),
    businessType: businessType.value,
    reviews: reviews
  }

  existingLists.unshift(newList) // Add new list to the top
  localStorage.setItem(storageKey, JSON.stringify(existingLists.slice(0, 10))) // Limit to 10 lists
}
</script> 