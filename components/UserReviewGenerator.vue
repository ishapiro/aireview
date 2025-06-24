<template>
  <div>
    <!-- Button to trigger the dialog -->
    <Button 
      @click="openDialog" 
      label="Dynamic AI Reviews for your Home or Business" 
      size="large" 
    />

    <!-- Review Generator Dialog -->
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Generate AI Product Reviews"
      :style="{ width: '90vw', maxWidth: '1000px' }"
      :closable="!isProcessing"
    >
      <div class="space-y-6">
        <!-- Step 1: Business Type Input -->
        <div v-if="currentStep === 1">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 1: Describe product need or enter a specific product name</h3>
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
                    :disabled="isProcessing"
                  />
                  <span class="text-sm text-gray-700">Consumer Review</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="reviewType"
                    value="business"
                    class="mr-2 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                    :disabled="isProcessing"
                  />
                  <span class="text-sm text-gray-700">Business Review</span>
                </label>
              </div>
            </div>
            <div>
              <label for="business-type" class="block text-sm font-medium text-gray-700 mb-2">
                Product Type or Need:
              </label>
              <InputText
                id="business-type"
                v-model="businessType"
                class="w-full"
                placeholder="e.g., 'Vacuum Cleaner for a 2000 square foot home', 'Project management for a small team'"
                :disabled="isProcessing"
              />
            </div>
            <div class="flex justify-end">
              <Button
                @click="generateProductList"
                :loading="isGeneratingProducts"
                :disabled="!businessType.trim() || !reviewType"
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
              <p class="text-sm text-gray-600">A new list has been created for you with these reviews.</p>
              <div class="max-h-60 overflow-y-auto space-y-2">
                <div v-for="review in generatedReviews" :key="review.id" class="bg-white border border-gray-200 rounded p-3">
                  <div class="flex justify-between items-start">
                    <NuxtLink :to="`/reviews/${review.slug}`" class="flex-1">
                      <h5 class="text-sm font-medium text-primary-600 hover:underline">{{ cleanTitle(review.title) }}</h5>
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
import { ref, computed, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { format } from 'date-fns'
import { cleanTitle } from '~/utils/string'
import stringSimilarity from 'string-similarity'

const client = useSupabaseClient()
const user = useSupabaseUser()

// Dialog state
const showDialog = ref(false)
const currentStep = ref(1)
const isProcessing = ref(false)
const error = ref('')

// User Input
const businessType = ref('')
const reviewType = ref('business')

// Product generation state
const products = ref([])
const isGeneratingProducts = ref(false)

// Review generation state
const currentProductIndex = ref(0)
const generatedReviews = ref([])
let newListId = null

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

const generateProductList = async () => {
  if (!businessType.value.trim() || !reviewType.value) return

  isGeneratingProducts.value = true
  error.value = ''

  try {
    const productList = await aiGenerator.value.generateProductList(businessType.value, reviewType.value)
    
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

  // Fetch all categories for fuzzy matching
  let allCategories = []
  try {
    const { data: categoriesData, error: categoriesError } = await client
      .from('categories')
      .select('id, name')
    if (categoriesError) throw categoriesError
    allCategories = categoriesData || []
  } catch (err) {
    console.error('Error fetching categories for fuzzy matching:', err)
  }

  // Create a new saved list for this batch
  try {
    const listName = businessType.value.length > 60
      ? businessType.value.substring(0, 60) + '...'
      : businessType.value
    
    const { data: createdListId, error: listError } = await client.rpc('create_saved_list', {
      list_name: listName
    })

    if (listError) throw listError
    newListId = createdListId
  } catch (err) {
    error.value = `Error creating a new saved list: ${err.message}`
    isProcessing.value = false
    return
  }

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
        if (newListId) {
          await client.rpc('add_to_saved_list', { p_list_id: newListId, p_review_id: existingReview.id })
        }
        continue
      }

      const reviewData = await aiGenerator.value.generateProductReview(currentProduct, businessType.value, reviewType.value)
      
      if (reviewData) {
        let categoryIds = [];
        if (reviewData.category && reviewData.category.trim() && allCategories.length > 0) {
          // Fuzzy match
          const categoryNames = allCategories.map(cat => cat.name)
          const { bestMatch } = stringSimilarity.findBestMatch(reviewData.category.trim(), categoryNames)
          if (bestMatch.rating > 0.8) {
            const matchedCategory = allCategories.find(cat => cat.name === bestMatch.target)
            if (matchedCategory) {
              categoryIds = [matchedCategory.id]
            }
          } else {
            // Fallback to previous logic: partial ilike match
            const { data: categoryData } = await client
              .from('categories')
              .select('id')
              .ilike('name', `%${reviewData.category.trim()}%`)
              .maybeSingle();
            if (categoryData) {
              categoryIds = [categoryData.id];
            }
          }
        }
        
        const payload = {
          title: cleanTitle(reviewData.title),
          summary: reviewData.summary,
          content: reviewData.content,
          rating: reviewData.rating,
          is_published: true, // Save as published
          ai_generated: true,
          user_id: user.value.id
        };
        console.log('Payload for creating review:', payload);
        
        // Generate slug from title
        const slug = await generateSlug(payload.title);
        
        // Create the review first
        const { data: newReview, error: createError } = await client
          .from('reviews')
          .insert({
            ...payload,
            slug: slug
          })
          .select('id, title, slug')
          .single();
          
        if (createError) {
          console.error('Error creating review:', createError);
          throw createError;
        }
        
        // Add category associations if we have category IDs
        if (categoryIds.length > 0) {
          const categoryAssociations = categoryIds.map(categoryId => ({
            review_id: newReview.id,
            category_id: categoryId
          }));
          
          const { error: categoryError } = await client
            .from('review_categories')
            .insert(categoryAssociations);
            
          if (categoryError) {
            console.error('Error adding category associations:', categoryError);
            // Don't throw here, as the review was created successfully
          }
        }
        
        finalReviewList.push({ id: newReview.id, title: newReview.title, slug: newReview.slug })

        // Add the new review to our saved list
        if (newListId) {
          await client.rpc('add_to_saved_list', { p_list_id: newListId, p_review_id: newReview.id })
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      console.error(`Error processing product ${currentProduct}:`, err)
    }
  }
   
  generatedReviews.value = finalReviewList

  isProcessing.value = false
  currentStep.value = 3
}
</script> 