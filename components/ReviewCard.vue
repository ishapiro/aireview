<template>
  <div v-if="review" class="card review-card no-underline relative">
    <NuxtLink 
      class="no-underline" 
      :to="review.is_published ? `/reviews/${review.slug}` : `/admin/reviews/${review.id}`" 
      @click="handleCardClick">
      <div class="flex items-between gap-2 text-sm">
        <div v-if="!review.is_published" class="bg-red-600 text-white px-2 py-1 rounded text-sm">
          <i class="pi pi-file-edit mr-1"></i>
          DRAFT
        </div>
        <!-- <div v-if="review.ai_generated" class="bg-blue-600 text-white px-2 py-1 rounded text-sm">
          <i class="pi pi-robot mr-1"></i>
          AI Augmented
        </div> -->
      </div>
      <div class="relative">
        <h3 
          class="text-xl font-bold text-gray-900 mb-2 pr-10 truncate leading-tight"
          :title="cleanTitle(review.title)"
        >
          {{ truncate(cleanTitle(review.title), 50) }}
        </h3>
        <img
          v-if="review.thumbnail_url"
          :src="review.thumbnail_url"
          :alt="cleanTitle(review.title)"
          class="w-full h-48 object-cover rounded-lg mb-4"
        />
      </div>
      <p class="text-base text-gray-600 mb-4 leading-relaxed line-clamp-3">{{ reviewSummary }}</p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <!-- Author information removed -->
        </div>
        
        <div class="flex items-center">
          <div class="star-rating mr-2" v-if="review.rating > 1">
            <i class="pi pi-star-fill mr-1"></i>
            {{ review.rating.toFixed(1) }}
          </div>
          <span class="text-sm text-gray-500">
            {{ formatDate(review.created_at) }}
          </span>
        </div>
      </div>

      <!-- Add metrics -->
      <div class="mt-4 flex items-center justify-end text-sm text-gray-500 space-x-4 min-h-[1.5rem]">
        <span v-if="review.views_count > 0">
          <i class="pi pi-eye mr-1"></i>
          {{ review.views_count }} views
        </span>
        <span v-if="review.helpful_count > 0">
          <i class="pi pi-thumbs-up mr-1"></i>
          {{ review.helpful_count }} found helpful
        </span>
      </div>

      <div
        class="mt-4 flex flex-nowrap gap-2 overflow-x-auto pb-2"
        v-if="Array.isArray(review.categories) && review.categories.length > 0">
        <span
          v-for="category in review.categories"
          :key="category.id"
          class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap"
        >
          {{ category.name }}
        </span>
      </div>
    </NuxtLink>
    
    <!-- Save to List Button (outside the NuxtLink to prevent navigation) -->
    <div class="absolute top-2 right-2 z-10" @click.stop>
      <SaveToList :review-id="review.id" />
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { stripMarkdown } from '@/utils/string'
import { computed } from 'vue'
import { cleanTitle } from '~/utils/string'

const { review } = defineProps({
  review: {
    type: Object,
    required: true
  }
})

const handleCardClick = (event) => {
  console.log('[ReviewCard] Card clicked, navigating to review:', review.slug)
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const truncate = (text, length) => {
  if (!text || typeof text !== 'string') {
    return ''
  }
  if (text.length <= length) {
    return text
  }
  return text.substring(0, length) + '...'
}

// Computed property to get review summary
const reviewSummary = computed(() => {
  // Use summary field if it has content
  if (review.summary && review.summary.trim()) {
    return review.summary.length > 200 
      ? review.summary.substring(0, 200) + '...' 
      : review.summary
  }
  
  // Fall back to stripped content from full content field
  if (review.content) {
    const strippedContent = stripMarkdown(review.content)
    return strippedContent.length > 200 
      ? strippedContent.substring(0, 200) + '...' 
      : strippedContent
  }
  
  return ''
})
</script>

<style scoped>
.save-xs-btn :deep(button),
.save-xs-btn :deep(.p-button) {
  padding: 2px 8px !important;
  font-size: 0.75rem !important;
  min-width: unset !important;
  height: 1.5rem !important;
  line-height: 1rem !important;
}
.save-xs-btn :deep(.pi) {
  font-size: 0.9em !important;
}
</style> 