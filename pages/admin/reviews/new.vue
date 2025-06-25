<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Create New Review</h1>
      <NuxtLink to="/admin/reviews">
        <Button label="Back to Reviews" icon="pi pi-arrow-left" />
      </NuxtLink>
    </div>

    <Card>
      <template #content>
        <div class="space-y-6">
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <InputText
                id="title"
                v-model="form.title"
                class="w-full"
                required
                @blur="checkForDuplicates"
              />
              <!-- Duplicate Reviews Warning -->
              <div v-if="duplicateReviews.length > 0" class="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div class="flex items-start">
                  <i class="pi pi-exclamation-triangle text-yellow-600 mt-0.5 mr-2"></i>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-yellow-800 mb-2">
                      Similar reviews found ({{ duplicateReviews.length }})
                    </h4>
                    <div class="space-y-2 max-h-40 overflow-y-auto">
                      <div 
                        v-for="review in duplicateReviews" 
                        :key="review.id"
                        class="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <div class="flex-1">
                          <NuxtLink 
                            :to="`/reviews/${review.slug}`" 
                            class="text-sm font-medium text-blue-600 hover:underline"
                            target="_blank"
                          >
                            {{ review.title }}
                          </NuxtLink>
                          <p class="text-xs text-gray-500 mt-1">
                            Rating: {{ review.rating }}/5 • {{ formatDate(review.created_at) }}
                          </p>
                        </div>
                        <div class="flex items-center space-x-2">
                          <Button
                            size="small"
                            icon="pi pi-eye"
                            @click="viewReview(review.slug)"
                            class="p-button-sm p-button-outlined"
                          />
                        </div>
                      </div>
                    </div>
                    <p class="text-xs text-yellow-700 mt-2">
                      Consider checking these reviews before creating a new one, or modify your title to be more unique.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="field">
              <label for="summary" class="block text-sm font-medium text-gray-700">Summary</label>
              <Textarea
                id="summary"
                v-model="form.summary"
                rows="3"
                class="w-full"
                placeholder="Enter a brief summary of your review (optional)"
              />
            </div>

            <div class="field">
              <label for="category" class="block text-sm font-medium text-gray-700">Categories</label>
              <MultiSelect
                id="category"
                v-model="form.category_ids"
                :options="categories"
                option-label="name"
                option-value="id"
                placeholder="Select categories"
                class="w-full"
                display="chip"
              />
            </div>

            <div class="field">
              <div class="flex items-center justify-between mb-2">
                <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
                <AIContentGenerator
                  v-model="form.content"
                  :summary-value="form.summary"
                  :generate-summary="true"
                  :title="form.title"
                  :rating-value="form.rating"
                  @update:summary-value="form.summary = $event"
                  @update:rating-value="handleAIRatingUpdate($event)"
                  @ai-generated="form.ai_generated = true"
                />
              </div>
              <Textarea
                id="content"
                v-model="form.content"
                rows="10"
                class="w-full"
                required
              />
            </div>

            <div class="field">
              <label for="rating" class="block text-sm font-medium text-gray-700">Rating</label>
              <InputNumber
                id="rating"
                v-model="form.rating"
                :min="1.0"
                :max="5.0"
                :step="0.1"
                :minFractionDigits="1"
                :maxFractionDigits="1"
                placeholder="Enter rating (1.0 - 5.0)"
                class="w-full"
                required
              />
              <p class="mt-1 text-sm text-gray-500">
                Enter a rating between 1.0 and 5.0 (e.g., 4.5)
              </p>
            </div>

            <div class="field">
              <div class="flex items-center">
                <InputSwitch
                  v-model="form.ai_generated"
                  class="mr-2"
                />
                <label class="text-sm font-medium text-gray-700">AI Generated</label>
              </div>
              <p class="mt-1 text-sm text-gray-500">
                Mark this review as created with AI assistance
              </p>
            </div>

            <div class="flex items-center space-x-4 mt-6">
              <Button
                type="submit"
                :loading="isSubmitting"
                label="Create Review"
              />
              <Button
                type="button"
                label="Save as Draft"
                @click="handleSaveAsDraft"
              />
            </div>
          </form>
        </div>
      </template>
    </Card>

    <Toast />
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import MultiSelect from 'primevue/multiselect'
import InputNumber from 'primevue/inputnumber'
import { watchEffect, watch } from 'vue'

definePageMeta({
  middleware: ['auth-admin']
})

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const router = useRouter()

const form = ref({
  title: '',
  summary: '',
  content: '',
  category_ids: [],
  rating: null,
  is_published: true,
  ai_generated: false
})

console.log('[new.vue] Initial form.value:', form.value)

// Duplicate checking state
const duplicateReviews = ref([])
const lastCheckedTitle = ref('')

// Watch for rating changes
watch(() => form.value.rating, (newRating, oldRating) => {
  console.log('[new.vue] form.value.rating changed from', oldRating, 'to', newRating)
})

const isSubmitting = ref(false)

// Fetch categories
const { data: categories } = await useAsyncData('categories-create-review', async () => {
  const { data } = await client
    .from('categories')
    .select('*')
    .order('name')
  
  return data
})

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

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    // Generate slug from title
    const slug = await generateSlug(form.value.title);
    
    // Create the review first
    const { data: newReview, error: createError } = await client
      .from('reviews')
      .insert({
        title: form.value.title,
        summary: form.value.summary,
        content: form.value.content,
        rating: form.value.rating,
        is_published: form.value.is_published,
        ai_generated: form.value.ai_generated,
        user_id: user.value.id,
        slug: slug
      })
      .select('id, title, slug')
      .single();

    if (createError) {
      throw createError;
    }

    // Add category associations if categories are selected
    if (form.value.category_ids.length > 0) {
      const categoryAssociations = form.value.category_ids.map(categoryId => ({
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

    // Navigate to the new review
    await navigateTo(`/reviews/${newReview.slug}`)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleSaveAsDraft = () => {
  form.value.is_published = false
  handleSubmit()
}

// Listen for AIContentGenerator rating updates
function handleAIRatingUpdate(rating) {
  console.log('[new.vue] handleAIRatingUpdate called with rating:', rating)
  console.log('[new.vue] rating type:', typeof rating)
  console.log('[new.vue] form.value before update:', form.value)
  console.log('[new.vue] form.value.rating before update:', form.value?.rating)
  
  if (!form.value || typeof form.value !== 'object') {
    console.log('[new.vue] form.value is not valid, returning early')
    return;
  }
  if (typeof rating === 'number' && !isNaN(rating)) {
    const newRating = Math.max(1.0, Math.min(5.0, rating))
    console.log('[new.vue] Setting form.value.rating to:', newRating)
    form.value.rating = newRating
    console.log('[new.vue] form.value.rating after update:', form.value.rating)
  } else {
    console.log('[new.vue] Rating is not a valid number:', rating)
  }
}

const checkForDuplicates = async () => {
  const title = form.value.title?.trim()
  
  // Don't check if title is empty or hasn't changed
  if (!title || title === lastCheckedTitle.value) {
    return
  }
  
  console.log('[new.vue] Checking for duplicates with title:', title)
  
  try {
    // Search for reviews with similar titles using full-text search
    const { data: similarReviews, error } = await client
      .from('reviews')
      .select('id, title, slug, rating, created_at')
      .or(`title.ilike.%${title}%,title.ilike.${title}%,title.ilike.%${title}`)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) {
      console.error('[new.vue] Error checking for duplicates:', error)
      return
    }
    
    // Filter out exact matches and very similar titles
    const duplicates = similarReviews.filter(review => {
      const reviewTitle = review.title.toLowerCase()
      const inputTitle = title.toLowerCase()
      
      // Check for exact match or very high similarity
      return reviewTitle === inputTitle || 
             reviewTitle.includes(inputTitle) || 
             inputTitle.includes(reviewTitle) ||
             calculateSimilarity(reviewTitle, inputTitle) > 0.8
    })
    
    duplicateReviews.value = duplicates
    lastCheckedTitle.value = title
    
    console.log('[new.vue] Found duplicates:', duplicates.length)
  } catch (error) {
    console.error('[new.vue] Error in duplicate check:', error)
  }
}

const viewReview = (slug) => {
  // Open review in new tab
  window.open(`/reviews/${slug}`, '_blank')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'N/A'
  }
}

// Simple similarity calculation using Levenshtein distance
const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

const levenshteinDistance = (str1, str2) => {
  const matrix = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}
</script> 