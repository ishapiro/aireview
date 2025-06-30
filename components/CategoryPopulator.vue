<template>
  <div>
    <!-- Populate Category Button (only show if no category prop) -->
    <div
      v-if="!category"
      @click="openDialog"
      class="group bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
    >
      <div class="flex items-center">
        <div class="p-1.5 sm:p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          <i class="pi pi-robot text-blue-600 text-base sm:text-lg"></i>
        </div>
        <div class="ml-2 sm:ml-3 flex-1">
          <h4 class="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">AI Tag Management</h4>
          <p class="text-xs text-gray-600 mt-0.5 sm:mt-1">Add or refresh reviews with AI assistance</p>
        </div>
        <i class="pi pi-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors text-sm"></i>
      </div>
    </div>

    <!-- Category Populator Dialog -->
    <Dialog
      v-model:visible="showDialog"
      modal
      header="AI Tag Management"
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
                <h4 class="text-lg font-medium text-gray-900">Update Products in a Tag</h4>
              </div>
              <p class="text-sm text-gray-600">
                Generate new products and reviews for this tag. This will add new reviews without affecting existing ones.
              </p>
            </div>
            
            <div 
              class="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-300 transition-colors"
              :class="selectedAction === 'regenerate_reviews' ? 'border-blue-500 bg-blue-50' : ''"
              @click="selectAction('regenerate_reviews')"
            >
              <div class="flex items-center mb-3">
                <i class="pi pi-refresh text-2xl text-blue-600 mr-3"></i>
                <h4 class="text-lg font-medium text-gray-900">Refresh Existing Reviews</h4>
              </div>
              <p class="text-sm text-gray-600">
                Refresh the content of existing reviews in this category with new AI-generated content.
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
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Step 1: {{ selectedAction === 'regenerate_reviews' ? 'Select Category to Refresh' : 'Enter Category Name' }}
          </h3>
          <div class="space-y-4">
            <!-- Category Selection for Refresh Reviews -->
            <div v-if="selectedAction === 'regenerate_reviews'">
              <label for="category-select" class="block text-sm font-medium text-gray-700 mb-2">
                Select Category:
              </label>
              <Dropdown
                id="category-select"
                v-model="selectedCategory"
                :options="availableCategories"
                option-label="name"
                placeholder="Choose a category"
                class="w-full"
                :disabled="isProcessing || isLoadingCategories"
              />
              <p class="text-sm text-gray-500 mt-1">
                Select a category to see existing reviews that can be refreshed.
              </p>
            </div>
            
            <!-- Category Name Input for Update Products -->
            <div v-else>
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
                v-if="selectedAction === 'regenerate_reviews'"
                @click="selectCategoryForRegeneration"
                :loading="isLoadingCategories"
                :disabled="!selectedCategory"
                label="Continue"
                icon="pi pi-arrow-right"
              />
              <Button
                v-else
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
            
            <!-- Progress for Product List Generation -->
            <div v-if="isGeneratingProducts" class="space-y-2">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Generating product list for {{ selectedCategory.name }}...</span>
                <span>Please wait</span>
              </div>
              <ProgressBar mode="indeterminate" />
              <p class="text-sm text-gray-600">
                <i class="pi pi-spin pi-spinner mr-2"></i>
                AI is analyzing the category and generating a list of popular products
              </p>
            </div>
            
            <!-- Generated Product List Preview -->
            <div v-if="products.length > 0 && !isGeneratingProducts" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center mb-3">
                <i class="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                <h4 class="text-sm font-medium text-green-900">Product List Generated Successfully!</h4>
              </div>
              <p class="text-sm text-green-700 mb-3">
                Found {{ products.length }} products to review
              </p>
              <div class="max-h-40 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div 
                    v-for="(product, index) in products.slice(0, 10)" 
                    :key="index"
                    class="text-sm text-gray-700 flex items-center"
                  >
                    <i class="pi pi-check-circle text-green-500 mr-2"></i>
                    {{ product }}
                  </div>
                </div>
                <div v-if="products.length > 10" class="text-sm text-gray-500 mt-2">
                  ... and {{ products.length - 10 }} more products
                </div>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <Button
                  v-if="products.length === 0"
                  @click="generateProductList"
                  :loading="isGeneratingProducts"
                  :disabled="isGeneratingProducts"
                  label="Generate Product List"
                  icon="pi pi-list"
                />
                <Button
                  v-if="rawAIResponse"
                  @click="showDebugDialog = true"
                  :disabled="isGeneratingProducts"
                  label="Debug Response"
                  icon="pi pi-bug"
                  class="p-button-secondary"
                  size="small"
                />
              </div>
              <div class="flex items-center space-x-2">
                <Button
                  v-if="products.length > 0"
                  @click="currentStep = 3"
                  :disabled="isGeneratingProducts"
                  label="Continue to Review Generation"
                  icon="pi pi-arrow-right"
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
        </div>

        <!-- Step 2: Review Selection (for Refresh Reviews) -->
        <div v-if="currentStep === 2 && selectedAction === 'regenerate_reviews'">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 2: Select Reviews to Refresh</h3>
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
                label="Start Refreshing Reviews"
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

            <!-- Enhanced Progress -->
            <div v-if="isProcessing" class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex justify-between text-sm text-gray-600 pb-2">
                  <span>It take about 10-15 seconds to search the web and combined everything we learn
                    to create a review for each product.
                  </span>
                </div>
                <div class="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Processing: {{ currentProductIndex + 1 }} of {{ products.length }}</span>
                  <span>{{ Math.round(((currentProductIndex + 1) / products.length) * 100) }}%</span>
                </div>
                <ProgressBar :value="((currentProductIndex + 1) / products.length) * 100" class="mb-3" />
                
                <div class="space-y-2">
                  <p class="text-sm text-gray-600">
                    <i class="pi pi-spin pi-spinner mr-2"></i>
                    Currently processing: <strong>{{ currentProduct }}</strong>
                  </p>
                  
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>Generated: {{ generatedReviews.length }}</span>
                    <span>Skipped: {{ currentProductIndex - generatedReviews.length }}</span>
                    <span>Remaining: {{ products.length - currentProductIndex - 1 }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Recent Activity -->
              <div v-if="generatedReviews.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-3">
                <h5 class="text-sm font-medium text-green-900 mb-2">Recently Generated:</h5>
                <div class="max-h-32 overflow-y-auto space-y-1">
                  <div 
                    v-for="review in generatedReviews.slice(-3)" 
                    :key="review.id"
                    class="text-xs text-green-700 flex items-center"
                  >
                    <i class="pi pi-check-circle text-green-500 mr-1"></i>
                    {{ cleanTitle(review.title) }}
                  </div>
                </div>
              </div>
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

        <!-- Step 3: Review Refresh Progress -->
        <div v-if="currentStep === 3 && selectedAction === 'regenerate_reviews'">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 3: Refreshing Reviews</h3>
          <div class="space-y-4">
            <!-- Progress -->
            <div v-if="isProcessing" class="space-y-2">
              <div class="flex justify-between text-sm text-gray-600 pb-2">
                <span>It take about 10-15 seconds to search the web and combined everything we learn
                  to create a review for each product.
                </span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Processing: {{ currentReviewIndex + 1 }} of {{ selectedReviews.length }}</span>
                <span>{{ Math.round(((currentReviewIndex + 1) / selectedReviews.length) * 100) }}%</span>
              </div>
              <ProgressBar :value="((currentReviewIndex + 1) / selectedReviews.length) * 100" />
              <p class="text-sm text-gray-600">
                Currently refreshing: <strong>{{ cleanTitle(currentReviewTitle) }}</strong>
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
                    {{ selectedAction === 'update_products' ? 'Category Population Complete!' : 'Review Refresh Complete!' }}
                  </h4>
                  <p class="text-sm text-green-700 mt-1">
                    {{ selectedAction === 'update_products' 
                      ? `Successfully generated ${generatedReviews.length} new reviews for ${selectedCategory.name}`
                      : `Successfully refreshed ${regeneratedReviews.length} reviews for ${selectedCategory.name}`
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

            <!-- Refreshed Reviews Summary -->
            <div v-if="regeneratedReviews.length > 0" class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900">Refreshed Reviews:</h4>
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

  <!-- Debug Dialog for Raw AI Response -->
  <Dialog
    v-model:visible="showDebugDialog"
    modal
    header="Raw AI Response Debug"
    :style="{ width: '90vw', maxWidth: '800px' }"
  >
    <div class="space-y-4">
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Category:</h4>
        <p class="text-sm text-gray-700">{{ selectedCategory?.name }}</p>
      </div>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-yellow-900 mb-2">Raw AI Response:</h4>
        <pre class="text-xs text-yellow-800 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">{{ rawAIResponse }}</pre>
      </div>
      
      <div v-if="products.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-green-900 mb-2">Parsed Products ({{ products.length }}):</h4>
        <div class="space-y-1">
          <div 
            v-for="(product, index) in products" 
            :key="index"
            class="text-sm text-green-800"
          >
            {{ index + 1 }}. {{ product }}
          </div>
        </div>
      </div>
      
      <div v-else class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-red-900 mb-2">No Products Parsed:</h4>
        <p class="text-sm text-red-800">The AI response could not be parsed into a product list.</p>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end">
        <Button @click="showDebugDialog = false" label="Close" />
      </div>
    </template>
  </Dialog>
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
const availableCategories = ref([])
const isLoadingCategories = ref(false)

// Product generation state
const products = ref([])
const isGeneratingProducts = ref(false)
const rawAIResponse = ref('')
const showDebugDialog = ref(false)

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

// Slug generation function
const generateSlug = async (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
  
  // Get existing slugs to check for uniqueness
  const { data: existingReviews } = await client
    .from('reviews')
    .select('slug')
    .ilike('slug', `${baseSlug}%`)
  
  const existingSlugs = existingReviews?.map(review => review.slug) || []
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }
  
  // If slug exists, append a number
  let counter = 1
  let newSlug = `${baseSlug}-${counter}`
  while (existingSlugs.includes(newSlug)) {
    counter++
    newSlug = `${baseSlug}-${counter}`
  }
  
  return newSlug
}

const resetState = () => {
  if (!props.category) {
    currentStep.value = 0
    categoryName.value = ''
    selectedCategory.value = null
    availableCategories.value = []
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
  isLoadingCategories.value = false
  rawAIResponse.value = ''
  showDebugDialog.value = false
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
      loadAvailableCategories()
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
      console.error(`Error refreshing review ${review.title}:`, error)
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

const generateProductList = async () => {
  isGeneratingProducts.value = true
  error.value = ''

  try {
    // Log the AI Product Search event
    const { error: logError } = await client.rpc('log_user_activity', {
      activity_type: 'ai_product_search',
      activity_metadata: {
        category_id: selectedCategory.value.id,
        category_name: selectedCategory.value.name
      }
    })
    if (logError) {
      console.error('Error logging AI Product Search:', logError)
    }

    // Use the AI Generator's product list function
    const result = await aiGenerator.value.generateProductList(selectedCategory.value.name)
    console.log('[CategoryPopulator] Raw productList API reply:', result);
    
    // Store the raw response for debugging
    rawAIResponse.value = result.rawResponse || 'No raw response available'
    
    if (result.products && result.products.length > 0) {
      products.value = result.products
      currentStep.value = 3
    } else {
      console.warn('[CategoryPopulator] No products generated. API reply:', result);
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
        // Generate slug from title
        const slug = await generateSlug(cleanTitle(removeMarkdown(reviewData.title)));
        
        // Create the review in the database
        const { data: newReview, error: createError } = await client
          .from('reviews')
          .insert({
            title: cleanTitle(removeMarkdown(reviewData.title)),
            summary: reviewData.summary,
            content: reviewData.content,
            rating: reviewData.rating,
            is_published: true,
            ai_generated: true,
            user_id: user.value.id,
            slug: slug
          })
          .select('id, title, slug')
          .single();

        if (createError) {
          console.error('Error creating review:', createError);
          throw createError;
        }

        // Add category associations if we have category IDs
        if (selectedCategory.value.id) {
          const categoryAssociations = [{
            review_id: newReview.id,
            category_id: selectedCategory.value.id
          }];

          const { error: categoryError } = await client
            .from('review_categories')
            .insert(categoryAssociations);

          if (categoryError) {
            console.error('Error adding category associations:', categoryError);
            // Don't throw here, as the review was created successfully
          }
        }

        generatedReviews.value.push({
          id: newReview.id,
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

// Load available categories for selection
const loadAvailableCategories = async () => {
  isLoadingCategories.value = true
  try {
    const { data: categories } = await client
      .from('categories')
      .select('id, name, description')
      .order('name')
    
    availableCategories.value = categories || []
  } catch (error) {
    console.error('Error loading categories:', error)
    error.value = `Error loading categories: ${error.message}`
  } finally {
    isLoadingCategories.value = false
  }
}

// Handle category selection for regeneration
const selectCategoryForRegeneration = async () => {
  if (!selectedCategory.value) return
  
  try {
    loadExistingReviews()
    currentStep.value = 2
  } catch (error) {
    console.error('Error selecting category:', error)
    error.value = `Error selecting category: ${error.message}`
  }
}
</script>