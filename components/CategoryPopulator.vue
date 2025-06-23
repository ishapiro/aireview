<template>
  <div>
    <!-- Populate Category Button (only show if no category prop) -->
    <button
      v-if="!category"
      type="button"
      @click="openDialog"
      class="btn-primary block text-center w-full text-base font-medium border-0"
    >
      Let AI Help Add or Refresh Reviews in This Category
    </button>

    <!-- Category Populator Dialog -->
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Category AI Management"
      :style="{ width: '90vw', maxWidth: '1000px' }"
      :closable="!isProcessing"
    >
      <div class="space-y-6">
        <!-- Step 0: Action Selection -->
        <div v-if="currentStep === 0">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Choose an Action</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              class="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-300 transition-colors"
              :class="selectedAction === 'update_products' ? 'border-blue-500 bg-blue-50' : ''"
              @click="selectAction('update_products')"
            >
              <div class="flex items-center mb-3">
                <i class="pi pi-list text-2xl text-blue-600 mr-3"></i>
                <h4 class="text-lg font-medium text-gray-900">Update Products in a Category</h4>
              </div>
              <p class="text-sm text-gray-600">
                Generate new products and reviews for this category. This will add new reviews without affecting existing ones.
              </p>
            </div>
            
            <div 
              class="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-300 transition-colors"
              :class="selectedAction === 'regenerate_reviews' ? 'border-blue-500 bg-blue-50' : ''"
              @click="selectAction('regenerate_reviews')"
            >
              <div class="flex items-center mb-3">
                <i class="pi pi-refresh text-2xl text-blue-600 mr-3"></i>
                <h4 class="text-lg font-medium text-gray-900">Regenerate Existing Reviews</h4>
              </div>
              <p class="text-sm text-gray-600">
                Update the content of existing reviews in this category with new AI-generated content.
              </p>
            </div>
          </div>
          
          <div class="flex justify-end mt-6">
            <Button
              @click="continueToNextStep"
              :disabled="!selectedAction"
              label="Continue"
              icon="pi pi-arrow-right"
            />
          </div>
        </div>

        <!-- Step 1: Category Input (only show if no category prop) -->
        <div v-if="currentStep === 1 && !category">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 1: Enter Category Name</h3>
          <div class="space-y-4">
            <div>
              <label for="category-name" class="block text-sm font-medium text-gray-700 mb-2">
                Category Name:
              </label>
              <InputText
                id="category-name"
                v-model="categoryName"
                class="w-full"
                placeholder="e.g., Smartphones, Laptops, Gaming"
                :disabled="isProcessing"
              />
            </div>
            <div class="flex justify-between items-center">
              <Button
                @click="currentStep = 0"
                label="Back"
                icon="pi pi-arrow-left"
              />
              <Button
                @click="checkOrCreateCategory"
                :loading="isCheckingCategory"
                :disabled="!categoryName.trim()"
                label="Continue"
                icon="pi pi-arrow-right"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Product List Generation (for Update Products) -->
        <div v-if="currentStep === 2 && selectedAction === 'update_products'">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 2: Generate Product List</h3>
          <div class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm text-blue-800">
                <strong>Category:</strong> {{ selectedCategory.name }}
              </p>
              <p class="text-sm text-blue-700 mt-1">
                {{ selectedCategory.description || 'No description available' }}
              </p>
            </div>
            
            <div class="flex justify-between items-center">
              <Button
                @click="generateProductList"
                :loading="isGeneratingProducts"
                :disabled="isGeneratingProducts"
                label="Generate Product List"
                icon="pi pi-list"
              />
              <Button
                v-if="!category"
                @click="currentStep = 1"
                :disabled="isGeneratingProducts"
                label="Back"
                icon="pi pi-arrow-left"
              />
              <Button
                v-else
                @click="currentStep = 0"
                :disabled="isGeneratingProducts"
                label="Back"
                icon="pi pi-arrow-left"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Review Selection (for Regenerate Reviews) -->
        <div v-if="currentStep === 2 && selectedAction === 'regenerate_reviews'">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 2: Select Reviews to Regenerate</h3>
          <div class="flex flex-col h-full">
            <div class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-sm text-blue-800">
                  <strong>Category:</strong> {{ selectedCategory.name }}
                </p>
                <p class="text-sm text-blue-700 mt-1">
                  {{ selectedCategory.description || 'No description available' }}
                </p>
              </div>
              
              <div v-if="existingReviews.length > 0" class="space-y-2">
                <div class="flex items-center justify-between pt-4">
                  <h4 class="text-sm font-medium text-gray-900">Existing Reviews:</h4>
                  <div class="flex items-center space-x-2">
                    <Button
                      @click="selectAllReviews"
                      size="small"
                      label="Select All"
                    />
                    <Button
                      @click="deselectAllReviews"
                      size="small"
                      label="Deselect All"
                    />
                  </div>
                </div>
                
                <div class="max-h-60 overflow-y-auto space-y-2 p-1">
                  <div 
                    v-for="review in existingReviews" 
                    :key="review.id"
                    class="flex items-center space-x-3 p-3 border border-gray-200 rounded hover:bg-gray-50"
                  >
                    <Checkbox
                      v-model="selectedReviews"
                      :value="review.id"
                      :binary="false"
                    />
                    <div class="flex-1">
                      <h5 class="text-sm font-medium text-gray-900">{{ cleanTitle(review.title) }}</h5>
                      <div class="flex items-center mt-1">
                        <div class="flex items-center space-x-1">
                          <i 
                            v-for="star in 5" 
                            :key="star"
                            class="text-sm"
                            :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                          >
                            <i class="pi pi-star-fill"></i>
                          </i>
                        </div>
                        <span class="ml-2 text-xs text-gray-500">({{ review.rating }}/5)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-8">
                <i class="pi pi-info-circle text-2xl text-gray-400 mb-2"></i>
                <p class="text-gray-600">No reviews found in this category.</p>
              </div>
            </div>
            
            <div class="mt-auto pt-6 flex justify-between items-center">
              <Button
                @click="startReviewRegeneration"
                :loading="isProcessing"
                :disabled="isProcessing || selectedReviews.length === 0"
                label="Start Regenerating Reviews"
                icon="pi pi-refresh"
              />
              <div class="flex items-center space-x-2">
                <Button
                  v-if="!category"
                  @click="currentStep = 1"
                  :disabled="isProcessing"
                  label="Back"
                  icon="pi pi-arrow-left"
                  class="p-button-secondary"
                />
                <Button
                  v-else
                  @click="currentStep = 0"
                  :disabled="isProcessing"
                  label="Back"
                  icon="pi pi-arrow-left"
                  class="p-button-secondary"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Review Generation (for Update Products) -->
        <div v-if="currentStep === 3 && selectedAction === 'update_products'">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 3: Generate Reviews</h3>
          <div class="space-y-4">
            <!-- Product List Display -->
            <div v-if="products.length > 0" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Products to Review:</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div 
                  v-for="(product, index) in products" 
                  :key="index"
                  class="text-sm text-gray-700 flex items-center"
                >
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
                Currently processing: <strong>{{ currentProduct }}</strong>
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
                @click="currentStep = 2"
                :disabled="isProcessing"
                label="Back"
                icon="pi pi-arrow-left"
              />
            </div>
          </div>
        </div>

        <!-- Step 3: Review Regeneration Progress -->
        <div v-if="currentStep === 3 && selectedAction === 'regenerate_reviews'">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 3: Regenerating Reviews</h3>
          <div class="space-y-4">
            <!-- Progress -->
            <div v-if="isProcessing" class="space-y-2">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Processing: {{ currentReviewIndex + 1 }} of {{ selectedReviews.length }}</span>
                <span>{{ Math.round(((currentReviewIndex + 1) / selectedReviews.length) * 100) }}%</span>
              </div>
              <ProgressBar :value="((currentReviewIndex + 1) / selectedReviews.length) * 100" />
              <p class="text-sm text-gray-600">
                Currently processing: <strong>{{ cleanTitle(currentReviewTitle) }}</strong>
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center">
              <Button
                @click="currentStep = 2"
                :disabled="isProcessing"
                label="Back"
                icon="pi pi-arrow-left"
              />
            </div>
          </div>
        </div>

        <!-- Step 4: Completion -->
        <div v-if="currentStep === 4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 4: Complete</h3>
          <div class="space-y-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <i class="pi pi-check-circle text-green-500 text-xl mr-3"></i>
                <div>
                  <h4 class="text-sm font-medium text-green-900">
                    {{ selectedAction === 'update_products' ? 'Category Population Complete!' : 'Review Regeneration Complete!' }}
                  </h4>
                  <p class="text-sm text-green-700 mt-1">
                    {{ selectedAction === 'update_products' 
                      ? `Successfully generated ${generatedReviews.length} reviews for ${selectedCategory.name}`
                      : `Successfully regenerated ${regeneratedReviews.length} reviews for ${selectedCategory.name}`
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Generated Reviews Summary -->
            <div v-if="generatedReviews.length > 0" class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900">Generated Reviews:</h4>
              <div class="max-h-60 overflow-y-auto space-y-2">
                <div 
                  v-for="review in generatedReviews" 
                  :key="review.id"
                  class="bg-white border border-gray-200 rounded p-3"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h5 class="text-sm font-medium text-gray-900">{{ cleanTitle(review.title) }}</h5>
                      <div class="flex items-center mt-1">
                        <div class="flex items-center space-x-1">
                          <i 
                            v-for="star in 5" 
                            :key="star"
                            class="text-sm"
                            :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                          >
                            <i class="pi pi-star-fill"></i>
                          </i>
                        </div>
                        <span class="ml-2 text-xs text-gray-500">({{ review.rating }}/5)</span>
                      </div>
                    </div>
                    <NuxtLink 
                      :to="`/admin/reviews/${review.id}`"
                      class="text-xs text-primary-600 hover:text-primary-700"
                    >
                      View
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Regenerated Reviews Summary -->
            <div v-if="regeneratedReviews.length > 0" class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900">Regenerated Reviews:</h4>
              <div class="max-h-60 overflow-y-auto space-y-2">
                <div 
                  v-for="review in regeneratedReviews" 
                  :key="review.id"
                  class="bg-white border border-gray-200 rounded p-3"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h5 class="text-sm font-medium text-gray-900">{{ cleanTitle(review.title) }}</h5>
                      <div class="flex items-center mt-1">
                        <div class="flex items-center space-x-1">
                          <i 
                            v-for="star in 5" 
                            :key="star"
                            class="text-sm"
                            :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                          >
                            <i class="pi pi-star-fill"></i>
                          </i>
                        </div>
                        <span class="ml-2 text-xs text-gray-500">({{ review.rating }}/5)</span>
                      </div>
                    </div>
                    <NuxtLink 
                      :to="`/admin/reviews/${review.id}`"
                      class="text-xs text-primary-600 hover:text-primary-700"
                    >
                      View
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <Button
                @click="closeDialog"
                label="Close"
                icon="pi pi-check"
              />
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            v-if="currentStep < 4 && currentStep !== 2 "
            type="button"
            @click="closeDialog"
            :disabled="isProcessing"
            label="Cancel"
            class="p-button-secondary"
          />
        </div>
      </template>
    </Dialog>

    <!-- Hidden AI Content Generator for reusing AI functions -->
    <AIContentGenerator ref="aiGenerator" style="display: none;" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { format } from 'date-fns'
import { cleanTitle, slugify, generateUniqueSlug } from '~/utils/string'

// Props
const props = defineProps({
  category: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close'])

const client = useSupabaseClient()
const user = useSupabaseUser()

// Dialog state
const showDialog = ref(false)
const currentStep = ref(0)
const isProcessing = ref(false)
const error = ref('')
const selectedAction = ref('')

// Category state
const categoryName = ref('')
const selectedCategory = ref(null)
const isCheckingCategory = ref(false)

// Product generation state
const products = ref([])
const isGeneratingProducts = ref(false)

// Review generation state
const currentProductIndex = ref(0)
const currentProduct = ref('')
const generatedReviews = ref([])

// Review regeneration state
const existingReviews = ref([])
const selectedReviews = ref([])
const currentReviewIndex = ref(0)
const currentReviewTitle = ref('')
const regeneratedReviews = ref([])

// AI Generator reference
const aiGenerator = ref(null)

const resetState = () => {
  if (!props.category) {
    currentStep.value = 0
    categoryName.value = ''
  } else {
    currentStep.value = 0
    selectedCategory.value = props.category
  }
  selectedAction.value = ''
  products.value = []
  generatedReviews.value = []
  existingReviews.value = []
  selectedReviews.value = []
  regeneratedReviews.value = []
  currentProductIndex.value = 0
  currentProduct.value = ''
  currentReviewIndex.value = 0
  currentReviewTitle.value = ''
  error.value = ''
  isProcessing.value = false
  isCheckingCategory.value = false
  isGeneratingProducts.value = false
}

// Watch for category prop changes - moved after resetState definition
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    selectedCategory.value = newCategory
    showDialog.value = true
    currentStep.value = 0 // Start with action selection
    resetState()
  }
}, { immediate: true })

const openDialog = () => {
  showDialog.value = true
  resetState()
}

const closeDialog = () => {
  showDialog.value = false
  resetState()
  emit('close')
}

const selectAction = (action) => {
  selectedAction.value = action
}

const continueToNextStep = () => {
  if (selectedAction.value === 'update_products') {
    if (props.category) {
      currentStep.value = 2
    } else {
      currentStep.value = 1
    }
  } else if (selectedAction.value === 'regenerate_reviews') {
    if (props.category) {
      loadExistingReviews()
      currentStep.value = 2
    } else {
      currentStep.value = 1
    }
  }
}

const loadExistingReviews = async () => {
  try {
    const { data: reviews } = await client
      .from('reviews')
      .select(`
        id,
        title,
        rating,
        review_categories!inner(category_id)
      `)
      .eq('review_categories.category_id', selectedCategory.value.id)
      .order('title')
    
    existingReviews.value = reviews || []
  } catch (error) {
    console.error('Error loading existing reviews:', error)
    error.value = `Error loading reviews: ${error.message}`
  }
}

const selectAllReviews = () => {
  selectedReviews.value = existingReviews.value.map(review => review.id)
}

const deselectAllReviews = () => {
  selectedReviews.value = []
}

const startReviewRegeneration = async () => {
  if (selectedReviews.value.length === 0) return

  isProcessing.value = true
  error.value = ''
  regeneratedReviews.value = []

  for (let i = 0; i < selectedReviews.value.length; i++) {
    currentReviewIndex.value = i
    const reviewId = selectedReviews.value[i]
    const review = existingReviews.value.find(r => r.id === reviewId)
    currentReviewTitle.value = review.title

    try {
      // Generate new content for this review
      const reviewData = await aiGenerator.value.generateProductReview(
        review.title, 
        selectedCategory.value.name
      )
      
      if (reviewData) {
        // Update the existing review
        const { error: updateError } = await client
          .from('reviews')
          .update({
            title: reviewData.title,
            summary: reviewData.summary,
            content: reviewData.content,
            rating: reviewData.rating,
            ai_generated: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', reviewId)

        if (updateError) throw updateError

        regeneratedReviews.value.push({
          id: reviewId,
          title: review.title,
          rating: reviewData.rating
        })
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error regenerating review ${review.title}:`, error)
      // Continue with next review
    }
  }

  currentStep.value = 4
  isProcessing.value = false
}

const checkOrCreateCategory = async () => {
  if (!categoryName.value.trim()) return

  isCheckingCategory.value = true
  error.value = ''

  try {
    // First, check if category exists
    const { data: existingCategory } = await client
      .from('categories')
      .select('*')
      .eq('name', categoryName.value.trim())
      .single()

    if (existingCategory) {
      selectedCategory.value = existingCategory
    } else {
      // Create new category
      const slug = await generateSlug(categoryName.value.trim())
      
      const { data: newCategory, error: createError } = await client
        .from('categories')
        .insert({
          name: categoryName.value.trim(),
          slug: slug,
          description: `AI-generated category for ${categoryName.value.trim()}`
        })
        .select()
        .single()

      if (createError) throw createError
      selectedCategory.value = newCategory
    }

    if (selectedAction.value === 'regenerate_reviews') {
      loadExistingReviews()
    }
    currentStep.value = 2
  } catch (error) {
    console.error('Error checking/creating category:', error)
    error.value = `Error: ${error.message}`
  } finally {
    isCheckingCategory.value = false
  }
}

const generateSlug = async (name) => {
  const baseSlug = slugify(name)
  
  // Get existing slugs to check for uniqueness
  const { data: existingCategories } = await client
    .from('categories')
    .select('slug')
  
  const existingSlugs = existingCategories?.map(cat => cat.slug) || []
  
  return generateUniqueSlug(baseSlug, existingSlugs)
}

const generateProductList = async () => {
  isGeneratingProducts.value = true
  error.value = ''

  try {
    // Use the AI Generator's product list function
    const productList = await aiGenerator.value.generateProductList(selectedCategory.value.name)
    
    if (productList && productList.length > 0) {
      products.value = productList
      currentStep.value = 3
    } else {
      throw new Error('No products could be generated')
    }
  } catch (error) {
    console.error('Error generating product list:', error)
    error.value = `Error generating product list: ${error.message}`
  } finally {
    isGeneratingProducts.value = false
  }
}

const startReviewGeneration = async () => {
  if (products.value.length === 0) return

  isProcessing.value = true
  error.value = ''
  generatedReviews.value = []

  for (let i = 0; i < products.value.length; i++) {
    currentProductIndex.value = i
    currentProduct.value = products.value[i]

    try {
      // Check if review already exists for this product
      const { data: existingReview } = await client
        .from('reviews')
        .select('id, title')
        .eq('title', currentProduct.value)
        .single()

      if (existingReview) {
        console.log(`Review already exists for ${currentProduct.value}, skipping...`)
        continue
      }

      // Generate review for this product using AI Generator
      const reviewData = await aiGenerator.value.generateProductReview(
        currentProduct.value, 
        selectedCategory.value.name
      )
      
      if (reviewData) {
        // Create the review in the database
        const { data: newReview, error: createError } = await client.rpc('create_review_with_categories', {
          new_title: cleanTitle(removeMarkdown(reviewData.title)),
          new_summary: reviewData.summary,
          new_content: reviewData.content,
          new_rating: reviewData.rating,
          new_is_published: true,
          new_ai_generated: true,
          new_category_ids: [selectedCategory.value.id],
          author_id: user.value.id
        })

        if (createError) throw createError

        generatedReviews.value.push({
          id: newReview,
          title: reviewData.title,
          rating: reviewData.rating
        })
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error processing product ${currentProduct.value}:`, error)
      // Continue with next product
    }
  }

  currentStep.value = 4
  isProcessing.value = false
}

const removeMarkdown = (text) => {
  if (!text || typeof text !== 'string') return ''
  return text.replace(/[*_~`#]/g, '')
}
</script> 