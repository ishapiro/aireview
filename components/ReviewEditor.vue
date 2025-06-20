<template>
  <div class="max-w-4xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="input-field mt-1"
          placeholder="Enter review title"
        />
      </div>

      <!-- Summary -->
      <div>
        <label for="summary" class="block text-sm font-medium text-gray-700">Summary</label>
        <textarea
          id="summary"
          v-model="form.summary"
          rows="3"
          required
          class="input-field mt-1"
          placeholder="Enter a brief summary of your review"
        ></textarea>
      </div>

      <!-- Rating -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div class="flex items-center space-x-2">
          <button
            v-for="rating in 5"
            :key="rating"
            type="button"
            @click="form.rating = rating"
            class="text-2xl focus:outline-none"
            :class="rating <= form.rating ? 'text-yellow-400' : 'text-gray-300'"
          >
            <i class="pi pi-star-fill"></i>
          </button>
        </div>
      </div>

      <!-- Categories -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Categories</label>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center"
          >
            <input
              :id="`category-${category.id}`"
              v-model="form.categories"
              :value="category.id"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              :for="`category-${category.id}`"
              class="ml-2 text-sm text-gray-700"
            >
              {{ category.name }}
            </label>
          </div>
        </div>
      </div>

      <!-- Thumbnail -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
        <div class="mt-1 flex items-center">
          <img
            v-if="form.thumbnail_url"
            :src="form.thumbnail_url"
            class="h-32 w-32 object-cover rounded-lg"
          />
          <div
            v-else
            class="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
          >
            <span class="text-gray-500">No image</span>
          </div>
          <button
            type="button"
            @click="handleImageUpload"
            class="ml-4 btn-secondary"
          >
            Upload Image
          </button>
        </div>
      </div>

      <!-- Content -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
          <AIContentGenerator
            v-model="form.content"
            @ai-generated="form.ai_generated = true"
          />
        </div>
        <div class="mt-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <textarea
              id="content"
              v-model="form.content"
              rows="20"
              required
              class="input-field font-mono"
              placeholder="Write your review in markdown..."
            ></textarea>
          </div>
          <div class="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg">
            <div v-html="renderedContent"></div>
          </div>
        </div>
      </div>

      <!-- AI Generated -->
      <div class="flex items-center">
        <input
          id="ai-generated"
          v-model="form.ai_generated"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="ai-generated" class="ml-2 text-sm text-gray-700">
          This review was created with AI assistance
        </label>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="btn-primary"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Saving...' : 'Save Review' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { marked } from 'marked'
import { slugify } from '@/utils/string'

const props = defineProps({
  review: {
    type: Object,
    default: () => ({
      title: '',
      summary: '',
      content: '',
      rating: 0,
      categories: [],
      thumbnail_url: '',
      ai_generated: false
    })
  }
})

const emit = defineEmits(['submit'])
const client = useSupabaseClient()
const { uploadThumbnail } = useImageUpload()

const form = ref({
  title: props.review.title,
  summary: props.review.summary,
  content: props.review.content,
  rating: props.review.rating,
  categories: props.review.categories || [],
  thumbnail_url: props.review.thumbnail_url,
  ai_generated: props.review.ai_generated
})

const isSubmitting = ref(false)

// Fetch categories
const { data: categories } = await useAsyncData('categories', async () => {
  const { data } = await client
    .from('categories')
    .select('*')
    .order('name')
  
  return data
})

// Render markdown preview
const renderedContent = computed(() => {
  return marked(form.value.content || '')
})

const handleImageUpload = async () => {
  try {
    const publicUrl = await uploadThumbnail()
    if (publicUrl) {
      form.value.thumbnail_url = publicUrl
    }
  } catch (error) {
    // Error handling is already done in the composable
    console.error('Error in handleImageUpload:', error)
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const reviewData = {
      ...form.value,
      slug: slugify(form.value.title)
    }

    emit('submit', reviewData)
  } catch (error) {
    console.error('Error saving review:', error)
    alert('Error saving review. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script> 