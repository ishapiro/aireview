<template>
  <div class="card review-card">
    <NuxtLink :to="`/reviews/${review.slug}`">
      <img
        :src="review.thumbnail_url"
        :alt="review.title"
        class="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ review.title }}</h3>
      <p class="text-gray-600 mb-4 line-clamp-3">{{ review.summary }}</p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img
            :src="review.author.avatar_url"
            :alt="review.author.full_name"
            class="w-8 h-8 rounded-full mr-2"
          />
          <span class="text-sm text-gray-600">{{ review.author.full_name }}</span>
        </div>
        
        <div class="flex items-center">
          <div class="star-rating mr-2">
            <i class="pi pi-star-fill mr-1"></i>
            {{ review.rating }}
          </div>
          <span class="text-sm text-gray-500">
            {{ formatDate(review.created_at) }}
          </span>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="category in review.categories"
          :key="category.id"
          class="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
        >
          {{ category.name }}
        </span>
      </div>

      <div v-if="review.ai_generated" class="mt-4">
        <span class="text-sm text-blue-600">
          <i class="pi pi-robot mr-1"></i>
          AI Assisted Review
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const props = defineProps({
  review: {
    type: Object,
    required: true
  }
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}
</script> 