<template>
  <div>
    <!-- Button to trigger the dialog -->
    <Button 
      @click="openDialog" 
      label="Generate New AI Reviews" 
      class="btn-primary rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-semibold w-full sm:w-auto"
    />

    <!-- Review Generator Dialog -->
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Generate AI Product Reviews"
      :style="{ width: '95vw', maxWidth: '600px' }"
      :closable="!isProcessing"
      class="sm:max-w-lg md:max-w-xl lg:max-w-2xl"
    >
      <div class="space-y-4 sm:space-y-6">
        <!-- Step 1: Business Type Input -->
        <div v-if="currentStep === 1">
          <h3 class="text-lg sm:text-xl font-medium text-gray-900 mb-4">Step 1: Choose Review Mode</h3>
          <div class="space-y-4">
            <!-- Mode Selection -->
            <div class="bg-gray-100 p-3 sm:p-4 rounded-lg mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                What would you like to do?
              </label>
              <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="mode"
                    value="find"
                    class="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    :disabled="isProcessing"
                  />
                  <span class="text-sm text-gray-700">Find multiple products to review</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="mode"
                    value="single"
                    class="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-600 focus:ring-green-500 border-gray-300"
                    :disabled="isProcessing"
                  />
                  <span class="text-sm text-gray-700">Review a Single Product</span>
                </label>
              </div>
            </div>
            <!-- Review Type Selection -->
            <div class="bg-gray-100 p-3 sm:p-4 rounded-lg mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Review Type:
              </label>
              <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="reviewType"
                    value="consumer"
                    class="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    :disabled="isProcessing"
                  />
                  <span class="text-sm text-gray-700">Consumer Review</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="reviewType"
                    value="business"
                    class="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-600 focus:ring-green-500 border-gray-300"
                    :disabled="isProcessing"
                  />
                  <span class="text-sm text-gray-700">Business Review</span>
                </label>
              </div>
            </div>
            <!-- Conditional Inputs -->
            <div v-if="mode === 'find'">
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
              <div class="flex justify-end mt-4">
                <Button
                  @click="generateProductList"
                  :loading="isGeneratingProducts"
                  :disabled="!businessType.trim() || !reviewType"
                  label="Find Products"
                  icon="pi pi-arrow-right"
                  class="w-full sm:w-auto"
                />
              </div>
            </div>
            <div v-else>
              <label for="single-product" class="block text-sm font-medium text-gray-700 mb-2">
                Product Name:
              </label>
              <InputText
                id="single-product"
                v-model="singleProductName"
                class="w-full"
                placeholder="e.g., 'iRobot Roomba 694'"
                :disabled="isProcessing"
              />
              <div class="flex justify-end mt-4">
                <Button
                  @click="reviewSingleProduct"
                  :loading="isProcessing"
                  :disabled="!singleProductName.trim() || !reviewType"
                  label="Review Product"
                  icon="pi pi-check"
                  class="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Review Generation -->
        <div v-if="currentStep === 2">
          <h3 class="text-lg sm:text-xl font-medium text-gray-900 mb-2">Step 2: Generating Reviews</h3>
          <div class="space-y-4">
            <!-- Product List Display -->
            <div v-if="products.length > 0" class="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Found Products:</h4>
              <div class="grid grid-cols-1 gap-2">
                <div v-for="(product, index) in products" :key="index" class="text-sm text-gray-700 flex items-center">
                  <i class="pi pi-check-circle text-green-500 mr-2 flex-shrink-0"></i>
                  <span class="break-words">{{ product }}</span>
                </div>
              </div>
            </div>

            <!-- Progress -->
            <div v-if="isProcessing" class="space-y-2">
              <div class="flex justify-between text-sm text-gray-600 pb-2">
                <span>It take about 10-15 seconds to search the web and combined everything we learn
                  to create a review for each product.
                </span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Processing: {{ currentProductIndex + 1 }} of {{ products.length }}</span>
                <span>{{ Math.round(((currentProductIndex + 1) / products.length) * 100) }}%</span>
              </div>
              <ProgressBar :value="((currentProductIndex + 1) / products.length) * 100" />
              <p class="text-sm text-gray-600">
                Currently processing: <strong class="break-words">{{ products[currentProductIndex] }}</strong>
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
              <Button
                @click="startReviewGeneration"
                :loading="isProcessing"
                :disabled="isProcessing || products.length === 0"
                label="Start Generating Reviews"
                icon="pi pi-play"
                class="w-full sm:w-auto order-2 sm:order-1"
              />
              <Button
                @click="currentStep = 1"
                :disabled="isProcessing"
                label="Back"
                icon="pi pi-arrow-left"
                class="w-full sm:w-auto order-1 sm:order-2"
              />
            </div>
          </div>
        </div>

        <!-- Step 3: Completion -->
        <div v-if="currentStep === 3">
          <h3 class="text-lg sm:text-xl font-medium text-gray-900 mb-4">Step 3: Complete</h3>
          <div class="space-y-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div class="flex items-start">
                <i class="pi pi-check-circle text-green-500 text-xl mr-3 flex-shrink-0 mt-0.5"></i>
                <div>
                  <h4 class="text-sm font-medium text-green-900">Review Generation Complete!</h4>
                  <p class="text-sm text-green-700 mt-1">
                    Successfully processed {{ products.length }} products.
                  </p>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-center space-y-3">
              <p class="text-sm text-gray-600 text-center">A new list has been created for you with these reviews.</p>
              <NuxtLink
                :to="newListId.value ? { path: '/saved-lists', query: { highlight: newListId.value } } : '/saved-lists'"
                class="btn-primary px-6 py-3 rounded text-white text-base sm:text-lg mt-2 w-full sm:w-auto text-center"
              >
                View My List
              </NuxtLink>
            </div>
            <div class="flex justify-end">
              <Button @click="closeDialog" label="Close" icon="pi pi-check" class="w-full sm:w-auto" />
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded text-sm">
          {{ error }}
        </div>
      </div>
    </Dialog>

    <!-- Similar Products Dialog -->
    <Dialog 
      v-model:visible="showSimilarDialog" 
      modal 
      header="Similar Products" 
      :style="{ width: '95vw', maxWidth: '500px' }"
      class="sm:max-w-lg"
    >
      <div>
        <div v-if="similarReviews.length > 0">
          <ul class="divide-y divide-gray-200">
            <li v-for="review in similarReviews" :key="review.id" class="py-3 cursor-pointer hover:bg-gray-50 rounded px-2" @click="() => { showSimilarDialog = false; showDialog = false; router.push(`/reviews/${review.slug}`) }">
              <div class="font-medium text-primary-700 text-sm sm:text-base">{{ review.title }}</div>
              <div class="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">{{ review.summary }}</div>
            </li>
          </ul>
        </div>
        <div v-else class="text-gray-500 text-sm sm:text-base">No similar products found.</div>
      </div>
      <template #footer>
        <div class="flex justify-end mt-4">
          <Button 
            @click="() => { showSimilarDialog = false; proceedWithAIReview() }" 
            label="Didn't find your product? Generate a new Review" 
            icon="pi pi-search" 
            class="w-full sm:w-auto text-sm"
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
import { cleanTitle } from '~/utils/string'
import stringSimilarity from 'string-similarity'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'

const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const nuxtApp = useNuxtApp()

// Dialog state
const showDialog = ref(false)
const currentStep = ref(1)
const isProcessing = ref(false)
const error = ref('')
const showSimilarDialog = ref(false)
const similarReviews = ref([])

// User Input
const businessType = ref('')
const reviewType = ref('consumer')
const mode = ref('find') // 'find' or 'single'
const singleProductName = ref('')

// Product generation state
const products = ref([])
const isGeneratingProducts = ref(false)

// Review generation state
const currentProductIndex = ref(0)
const generatedReviews = ref([])
const newListId = ref(null)

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
    const result = await aiGenerator.value.generateProductList(businessType.value, reviewType.value)
    
    if (result.products && result.products.length > 0) {
      products.value = result.products
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
    newListId.value = createdListId
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
        if (newListId.value) {
          await client.rpc('add_to_saved_list', { p_list_id: newListId.value, p_review_id: existingReview.id })
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
        
        // Use the slugBase from the AI response if available, otherwise generate from title
        let baseSlug = reviewData.slugBase ? reviewData.slugBase : cleanTitle(reviewData.title).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 30)
        // Ensure uniqueness
        const { data: existingReviews } = await client
          .from('reviews')
          .select('slug')
          .ilike('slug', `${baseSlug}%`)
        const existingSlugs = existingReviews?.map(review => review.slug) || []
        let slug = baseSlug
        if (existingSlugs.includes(baseSlug)) {
          let counter = 1
          let newSlug = `${baseSlug}-${counter}`
          while (existingSlugs.includes(newSlug)) {
            counter++
            newSlug = `${baseSlug}-${counter}`
          }
          slug = newSlug
        }
        
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
        if (newListId.value) {
          await client.rpc('add_to_saved_list', { p_list_id: newListId.value, p_review_id: newReview.id })
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

  // Log AI product search activity and refresh admin stats
  try {
    await client.rpc('log_user_activity', {
      activity_type: 'ai_product_search',
      activity_metadata: {}
    })
    if (nuxtApp && typeof nuxtApp.refreshNuxtData === 'function') {
      await nuxtApp.refreshNuxtData('admin-stats')
    }
  } catch (err) {
    console.error('Failed to log ai_product_search activity or refresh stats:', err)
  }
}

const reviewSingleProduct = async () => {
  if (!singleProductName.value.trim() || !reviewType.value) return
  isProcessing.value = true
  error.value = ''
  try {
    // Search for similar reviews using both ilike and textSearch
    const { data: ilikeMatches } = await client
      .from('reviews')
      .select('id, slug, title, summary')
      .ilike('title', `%${singleProductName.value.trim()}%`)
    const { data: textMatches } = await client
      .from('reviews')
      .select('id, slug, title, summary')
      .textSearch('title', singleProductName.value, { type: 'plain' })
    // Merge and deduplicate
    const foundReviews = [...(ilikeMatches || []), ...(textMatches || [])]
      .filter((review, index, self) =>
        index === self.findIndex(r => r.id === review.id)
      )
    if (foundReviews.length > 0) {
      // Use stringSimilarity to find the best match
      const titles = foundReviews.map(r => r.title)
      const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(singleProductName.value.trim(), titles)
      if (bestMatch.rating > 0.7) {
        const similar = foundReviews[bestMatchIndex]
        showDialog.value = false
        await router.push(`/reviews/${similar.slug}`)
        isProcessing.value = false
        return
      }
      similarReviews.value = foundReviews
      showSimilarDialog.value = true
      isProcessing.value = false
      return
    }
    // If no similar reviews, proceed with AI logic below
    await proceedWithAIReview()
  } catch (err) {
    error.value = `Error creating review: ${err.message}`
    isProcessing.value = false
  }
}

const proceedWithAIReview = async () => {
  isProcessing.value = true
  try {
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

    // Log product name and review type
    console.log('[Single Review] Product name:', singleProductName.value)
    console.log('[Single Review] Review type:', reviewType.value)

    // Generate the review using AI
    const reviewData = await aiGenerator.value.generateProductReview(singleProductName.value, '', reviewType.value)
    console.log('[Single Review] AI reviewData:', reviewData)
    if (!reviewData) throw new Error('No product with that name/model located')

    // Fuzzy match category if present
    let categoryIds = []
    if (reviewData.category && reviewData.category.trim() && allCategories.length > 0) {
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
    
    // Use the slugBase from the AI response if available, otherwise generate from title
    let baseSlug = reviewData.slugBase ? reviewData.slugBase : cleanTitle(reviewData.title).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 30)
    // Ensure uniqueness
    const { data: existingReviews } = await client
      .from('reviews')
      .select('slug')
      .ilike('slug', `${baseSlug}%`)
    const existingSlugs = existingReviews?.map(review => review.slug) || []
    let slug = baseSlug
    if (existingSlugs.includes(baseSlug)) {
      let counter = 1
      let newSlug = `${baseSlug}-${counter}`
      while (existingSlugs.includes(newSlug)) {
        counter++
        newSlug = `${baseSlug}-${counter}`
      }
      slug = newSlug
    }
    
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
    if (newListId.value) {
      await client.rpc('add_to_saved_list', { p_list_id: newListId.value, p_review_id: newReview.id })
    }
  } catch (err) {
    console.error(`Error processing product ${singleProductName.value}:`, err)
  }

  generatedReviews.value = finalReviewList

  isProcessing.value = false
  currentStep.value = 3

  // Log AI product search activity and refresh admin stats
  try {
    await client.rpc('log_user_activity', {
      activity_type: 'ai_product_search',
      activity_metadata: {}
    })
    if (nuxtApp && typeof nuxtApp.refreshNuxtData === 'function') {
      await nuxtApp.refreshNuxtData('admin-stats')
    }
  } catch (err) {
    console.error('Failed to log ai_product_search activity or refresh stats:', err)
  }
}
</script>