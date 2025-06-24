<template>
  <div>
    <!-- Categorize Uncategorized Reviews Button -->
    <button
      type="button"
      @click="openDialog"
      class="btn-primary block text-center w-full text-base font-medium border-0"
    >
      Categorize Uncategorized Reviews
    </button>

    <!-- Categorizer Dialog -->
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Categorize Uncategorized Reviews"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      :closable="!isProcessing"
    >
      <div class="space-y-6">
        <!-- Step 1: Find Uncategorized Reviews -->
        <div v-if="currentStep === 1">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 1: Find Uncategorized Reviews</h3>
          <div class="space-y-4">
            <p class="text-sm text-gray-600">
              This will find all reviews that don't have any categories assigned and suggest appropriate categories for them.
            </p>
            <div class="flex justify-end">
              <Button
                @click="findUncategorizedReviews"
                :loading="isFindingReviews"
                :disabled="isFindingReviews"
                label="Find Uncategorized Reviews"
                icon="pi pi-search"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Review and Categorize -->
        <div v-if="currentStep === 2">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 2: Review and Categorize</h3>
          <div class="space-y-4">
            <div v-if="uncategorizedReviews.length === 0" class="text-center py-8">
              <i class="pi pi-check-circle text-green-500 text-4xl mb-4"></i>
              <p class="text-lg text-gray-900">All reviews are already categorized!</p>
              <p class="text-sm text-gray-600 mt-2">No uncategorized reviews found.</p>
            </div>

            <div v-else class="space-y-4">
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-600">
                  Found {{ uncategorizedReviews.length }} uncategorized reviews
                </p>
                <div class="flex gap-2">
                  <Button
                    @click="categorizeAll"
                    :loading="isProcessing"
                    :disabled="isProcessing"
                    label="Categorize All"
                    icon="pi pi-check"
                    class="p-button-success"
                  />
                  <Button
                    @click="currentStep = 1"
                    :disabled="isProcessing"
                    label="Back"
                    icon="pi pi-arrow-left"
                  />
                </div>
              </div>

              <!-- Progress -->
              <div v-if="isProcessing" class="space-y-2">
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Processing: {{ currentReviewIndex + 1 }} of {{ uncategorizedReviews.length }}</span>
                  <span>{{ Math.round(((currentReviewIndex + 1) / uncategorizedReviews.length) * 100) }}%</span>
                </div>
                <ProgressBar :value="((currentReviewIndex + 1) / uncategorizedReviews.length) * 100" />
                <p class="text-sm text-gray-600">
                  Currently processing: <strong>{{ currentReview?.title }}</strong>
                </p>
              </div>

              <!-- Reviews List -->
              <div v-if="!isProcessing" class="max-h-96 overflow-y-auto space-y-4">
                <div 
                  v-for="review in uncategorizedReviews" 
                  :key="review.id"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                      <h4 class="text-sm font-medium text-gray-900">{{ cleanTitle(review.title) }}</h4>
                      <p class="text-xs text-gray-500 mt-1">{{ review.author?.full_name }} • {{ formatDate(review.created_at) }}</p>
                      <p v-if="review.content" class="text-xs text-gray-600 mt-1 italic">{{ getExcerpt(review.content) }}</p>
                    </div>
                    <div class="flex items-center space-x-1">
                      <i 
                        v-for="star in 5" 
                        :key="star"
                        class="text-xs"
                        :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                      >
                        <i class="pi pi-star-fill"></i>
                      </i>
                      <span class="ml-1 text-xs text-gray-500">({{ review.rating.toFixed(1) }}/5)</span>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div>
                      <MultiSelect
                        v-model="review.selectedCategories"
                        :options="sortedCategories"
                        option-label="name"
                        option-value="id"
                        placeholder="Select categories"
                        class="w-full"
                        display="chip"
                      />
                    </div>

                    <div class="flex gap-2">
                      <Button
                        :disabled="!review.selectedCategories.length"
                        @click="categorizeReview(review)"
                        size="small"
                        label="Apply Categories"
                        icon="pi pi-check"
                        class="p-button-success"
                      />
                      <Button
                        @click="skipReview(review)"
                        size="small"
                        label="Skip"
                        icon="pi pi-times"
                        class="p-button-secondary"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
                  <h4 class="text-sm font-medium text-green-900">Categorization Complete!</h4>
                  <p class="text-sm text-green-700 mt-1">
                    Successfully categorized {{ categorizedCount }} reviews
                  </p>
                  <p class="text-sm text-green-700">
                    Skipped {{ skippedCount }} reviews
                  </p>
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
    </Dialog>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { useToast } from 'primevue/usetoast'
import { ref, onMounted, computed } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { cleanTitle } from '~/utils/string'
import MultiSelect from 'primevue/multiselect'

const client = useSupabaseClient()
const toast = useToast()

// Dialog state
const showDialog = ref(false)
const currentStep = ref(1)
const isProcessing = ref(false)
const isFindingReviews = ref(false)
const error = ref('')

// Data
const uncategorizedReviews = ref([])
const currentReviewIndex = ref(0)
const currentReview = ref(null)
const categorizedCount = ref(0)
const skippedCount = ref(0)
const allCategories = ref([])

const sortedCategories = computed(() => {
  return [...allCategories.value].sort((a, b) => a.name.localeCompare(b.name))
})

const openDialog = () => {
  showDialog.value = true
  resetState()
}

const resetState = () => {
  currentStep.value = 1
  uncategorizedReviews.value = []
  currentReviewIndex.value = 0
  currentReview.value = null
  categorizedCount.value = 0
  skippedCount.value = 0
  error.value = ''
  isProcessing.value = false
  isFindingReviews.value = false
}

const closeDialog = () => {
  showDialog.value = false
  resetState()
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const getExcerpt = (content) => {
  if (!content) return ''
  // Match up to the end of the second sentence or 200 chars
  const match = content.match(/^(.{1,200}?([.!?]\s|$)){1,2}/)
  return match ? match[0].trim() : content.slice(0, 200)
}

const findUncategorizedReviews = async () => {
  isFindingReviews.value = true
  error.value = ''

  try {
    // Get all reviews that don't have any categories
    const { data: reviews, error: reviewsError } = await client
      .from('reviews')
      .select(`
        *,
        author:profiles(*),
        categories:review_categories(categories(*))
      `)
      .eq('is_published', true)

    if (reviewsError) throw reviewsError

    // Filter out reviews that already have categories
    const uncategorized = reviews.filter(review => 
      !review.categories || review.categories.length === 0
    )

    // Get all available categories for matching
    const { data: categories, error: categoriesError } = await client
      .from('categories')
      .select('*')

    if (categoriesError) throw categoriesError
    allCategories.value = categories

    // For each uncategorized review, suggest categories based on title and content
    const reviewsWithSuggestions = uncategorized.map(review => {
      const suggestedCategories = suggestCategoriesForReview(review, categories)
      return {
        ...review,
        suggestedCategories,
        selectedCategories: suggestedCategories.map(cat => cat.id) // initialize with suggested
      }
    })

    uncategorizedReviews.value = reviewsWithSuggestions
    currentStep.value = 2

    if (uncategorized.length === 0) {
      toast.add({
        severity: 'info',
        summary: 'No Uncategorized Reviews',
        detail: 'All reviews are already categorized!',
        life: 3000
      })
    } else {
      toast.add({
        severity: 'success',
        summary: 'Found Uncategorized Reviews',
        detail: `Found ${uncategorized.length} reviews without categories`,
        life: 3000
      })
    }

  } catch (err) {
    error.value = `Error finding uncategorized reviews: ${err.message}`
    console.error('Error finding uncategorized reviews:', err)
  } finally {
    isFindingReviews.value = false
  }
}

const suggestCategoriesForReview = (review, categories) => {
  const reviewText = `${review.title} ${review.content || ''} ${review.summary || ''}`.toLowerCase()
  const suggested = []

  for (const category of categories) {
    const categoryName = category.name.toLowerCase()
    const categoryWords = categoryName.split(/\s+/)
    
    // Check if any word from the category name appears in the review
    const hasMatch = categoryWords.some(word => 
      word.length > 2 && reviewText.includes(word)
    )
    
    if (hasMatch) {
      suggested.push(category)
    }
  }

  // Sort by relevance (categories with more word matches first)
  suggested.sort((a, b) => {
    const aWords = a.name.toLowerCase().split(/\s+/)
    const bWords = b.name.toLowerCase().split(/\s+/)
    const aMatches = aWords.filter(word => 
      word.length > 2 && reviewText.includes(word)
    ).length
    const bMatches = bWords.filter(word => 
      word.length > 2 && reviewText.includes(word)
    ).length
    return bMatches - aMatches
  })

  return suggested.slice(0, 3) // Limit to top 3 suggestions
}

const categorizeReview = async (review) => {
  if (!review.selectedCategories.length) return

  try {
    const categoryIds = review.selectedCategories
    // Add categories to the review
    const { error: insertError } = await client
      .from('review_categories')
      .insert(
        categoryIds.map(categoryId => ({
          review_id: review.id,
          category_id: categoryId
        }))
      )

    if (insertError) throw insertError

    // Remove from the list
    const index = uncategorizedReviews.value.findIndex(r => r.id === review.id)
    if (index > -1) {
      uncategorizedReviews.value.splice(index, 1)
    }

    categorizedCount.value++
    toast.add({
      severity: 'success',
      summary: 'Review Categorized',
      detail: `Added ${categoryIds.length} categories to "${review.title}"`,
      life: 2000
    })
  } catch (err) {
    console.error('Error categorizing review:', err)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to categorize "${review.title}": ${err.message}`,
      life: 3000
    })
  }
}

const skipReview = (review) => {
  const index = uncategorizedReviews.value.findIndex(r => r.id === review.id)
  if (index > -1) {
    uncategorizedReviews.value.splice(index, 1)
  }
  skippedCount.value++
}

const categorizeAll = async () => {
  if (uncategorizedReviews.value.length === 0) return

  isProcessing.value = true
  error.value = ''

  try {
    for (let i = 0; i < uncategorizedReviews.value.length; i++) {
      currentReviewIndex.value = i
      currentReview.value = uncategorizedReviews.value[i]
      
      const review = uncategorizedReviews.value[i]
      
      if (review.selectedCategories.length > 0) {
        await categorizeReview(review)
      } else {
        skipReview(review)
      }
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    currentStep.value = 3

  } catch (err) {
    error.value = `Error during bulk categorization: ${err.message}`
    console.error('Error during bulk categorization:', err)
  } finally {
    isProcessing.value = false
    currentReview.value = null
  }
}

const removeCategoryFromReview = (review, categoryToRemove) => {
  const reviewIndex = uncategorizedReviews.value.findIndex(r => r.id === review.id)
  if (reviewIndex > -1) {
    const updatedReview = { ...uncategorizedReviews.value[reviewIndex] }
    updatedReview.selectedCategories = updatedReview.selectedCategories.filter(
      cat => cat !== categoryToRemove.id
    )
    uncategorizedReviews.value[reviewIndex] = updatedReview
  }
}
</script> 