<template>
  <div>
    <!-- Populate Category Button -->
    <button
      type="button"
      @click="openDialog"
      class="btn-primary block text-center w-full text-sm font-medium"
    >
      Populate a Category
    </button>

    <!-- Category Populator Dialog -->
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Populate Category with AI Reviews"
      :style="{ width: '90vw', maxWidth: '1000px' }"
      :closable="!isProcessing"
    >
      <div class="space-y-6">
        <!-- Step 1: Category Input -->
        <div v-if="currentStep === 1">
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
            <div class="flex justify-end">
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

        <!-- Step 2: Product List Generation -->
        <div v-if="currentStep === 2">
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
                @click="currentStep = 1"
                :disabled="isGeneratingProducts"
                label="Back"
                icon="pi pi-arrow-left"
              />
            </div>
          </div>
        </div>

        <!-- Step 3: Review Generation -->
        <div v-if="currentStep === 3">
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

        <!-- Step 4: Completion -->
        <div v-if="currentStep === 4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 4: Complete</h3>
          <div class="space-y-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <i class="pi pi-check-circle text-green-500 text-xl mr-3"></i>
                <div>
                  <h4 class="text-sm font-medium text-green-900">Category Population Complete!</h4>
                  <p class="text-sm text-green-700 mt-1">
                    Successfully generated {{ generatedReviews.length }} reviews for {{ selectedCategory.name }}
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
                      <h5 class="text-sm font-medium text-gray-900">{{ review.title }}</h5>
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
            v-if="currentStep < 4"
            type="button"
            @click="closeDialog"
            :disabled="isProcessing"
            label="Cancel"
          />
        </div>
      </template>
    </Dialog>

    <!-- Hidden AI Content Generator for reusing AI functions -->
    <AIContentGenerator ref="aiGenerator" style="display: none;" />
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()

// Dialog state
const showDialog = ref(false)
const currentStep = ref(1)
const isProcessing = ref(false)
const error = ref('')

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

// AI Generator reference
const aiGenerator = ref(null)

const openDialog = () => {
  showDialog.value = true
  resetState()
}

const resetState = () => {
  currentStep.value = 1
  categoryName.value = ''
  selectedCategory.value = null
  products.value = []
  generatedReviews.value = []
  currentProductIndex.value = 0
  currentProduct.value = ''
  error.value = ''
  isProcessing.value = false
  isCheckingCategory.value = false
  isGeneratingProducts.value = false
}

const closeDialog = () => {
  showDialog.value = false
  resetState()
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
      const { data: newCategory, error: createError } = await client
        .from('categories')
        .insert({
          name: categoryName.value.trim(),
          slug: generateSlug(categoryName.value.trim()),
          description: `AI-generated category for ${categoryName.value.trim()}`
        })
        .select()
        .single()

      if (createError) throw createError
      selectedCategory.value = newCategory
    }

    currentStep.value = 2
  } catch (error) {
    console.error('Error checking/creating category:', error)
    error.value = `Error: ${error.message}`
  } finally {
    isCheckingCategory.value = false
  }
}

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
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
          new_title: reviewData.title,
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
</script> 