<template>
  <div>
    <div
      @click="showDialog = true"
      class="group bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 hover:shadow-md hover:border-purple-200 transition-all duration-200 cursor-pointer"
    >
      <div class="flex items-center">
        <div class="p-1.5 sm:p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
          <i class="pi pi-plus text-purple-600 text-base sm:text-lg"></i>
        </div>
        <div class="ml-2 sm:ml-3 flex-1">
          <h4 class="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">Append Categories</h4>
          <p class="text-xs text-gray-600 mt-0.5 sm:mt-1">Add categories to existing reviews</p>
        </div>
        <i class="pi pi-chevron-right text-gray-400 group-hover:text-purple-600 transition-colors text-sm"></i>
      </div>
    </div>
    <Dialog v-model:visible="showDialog" modal header="Append Category to Reviews" :style="{ width: '600px' }">
      <div class="space-y-4">
        <!-- Search Bar -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search Reviews</label>
          <InputText v-model="searchTerm" @keyup.enter="searchReviews" placeholder="Enter review title or keywords..." class="w-full" />
          <Button label="Search" class="mt-2" @click="searchReviews" :loading="isSearching" icon="pi pi-search" />
        </div>
        <!-- Review List -->
        <div v-if="reviews.length > 0" class="max-h-48 overflow-y-auto border rounded p-2">
          <div v-for="review in reviews" :key="review.id" class="flex items-center py-1">
            <Checkbox v-model="selectedReviewIds" :value="review.id" class="mr-2" />
            <span class="truncate">{{ review.title }}</span>
          </div>
        </div>
        <div v-else-if="searchTerm && !isSearching" class="text-gray-500">No reviews found.</div>
        <!-- Category Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
          <Dropdown v-model="selectedCategoryId" :options="categoryOptions" optionLabel="name" optionValue="id" placeholder="Choose a category..." class="w-full" />
        </div>
        <!-- Append Button -->
        <div class="flex justify-end">
          <Button label="Append Category" class="btn-primary" :disabled="!selectedCategoryId || selectedReviewIds.length === 0 || isAppending" @click="appendCategory" :loading="isAppending" icon="pi pi-plus" />
        </div>
        <div v-if="successMessage" class="text-green-600 text-sm mt-2">{{ successMessage }}</div>
        <div v-if="errorMessage" class="text-red-600 text-sm mt-2">{{ errorMessage }}</div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

const client = useSupabaseClient()
const showDialog = ref(false)
const searchTerm = ref('')
const reviews = ref([])
const isSearching = ref(false)
const selectedReviewIds = ref([])
const selectedCategoryId = ref(null)
const isAppending = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const categoryOptions = ref([])

// Fetch all categories on mount
onMounted(async () => {
  const { data, error } = await client.from('categories').select('id, name').order('name')
  if (!error) categoryOptions.value = data
})

const searchReviews = async () => {
  isSearching.value = true
  reviews.value = []
  selectedReviewIds.value = []
  try {
    const { data, error } = await client
      .from('reviews')
      .select('id, title')
      .textSearch('title', searchTerm.value, { type: 'plain' })
      .limit(30)
    if (!error) reviews.value = data
  } finally {
    isSearching.value = false
  }
}

const appendCategory = async () => {
  if (!selectedCategoryId.value || selectedReviewIds.value.length === 0) return
  isAppending.value = true
  successMessage.value = ''
  errorMessage.value = ''
  try {
    // Fetch existing associations for selected reviews and the chosen category
    const { data: existing } = await client
      .from('review_categories')
      .select('review_id')
      .in('review_id', selectedReviewIds.value)
      .eq('category_id', selectedCategoryId.value)
    const alreadyLinked = new Set((existing || []).map(r => r.review_id))
    // Prepare only new inserts
    const inserts = selectedReviewIds.value
      .filter(reviewId => !alreadyLinked.has(reviewId))
      .map(reviewId => ({ review_id: reviewId, category_id: selectedCategoryId.value }))
    if (inserts.length > 0) {
      const { error } = await client.from('review_categories').insert(inserts)
      if (error) throw error
    }
    successMessage.value = inserts.length > 0 ? 'Category appended to selected reviews.' : 'All selected reviews already have this category.'
    selectedReviewIds.value = []
  } catch (err) {
    errorMessage.value = err.message || 'Failed to append category.'
  } finally {
    isAppending.value = false
  }
}
</script> 