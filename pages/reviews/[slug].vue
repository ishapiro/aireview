<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="!review" class="text-center min-h-[400px] flex flex-col justify-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Review Not Found</h2>
      <p class="text-gray-600 mb-8">This review may have been removed or is not published.</p>
      <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">
        Return to Home
      </NuxtLink>
    </div>

    <div v-else class="bg-white rounded-lg shadow-lg p-6">
      <!-- Review Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ review.title }}</h1>
        
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <img
              :src="review.author.avatar_url || '/default-avatar.svg'"
              :alt="review.author.full_name"
              class="w-10 h-10 rounded-full mr-3 bg-gray-100"
              @error="$event.target.src = '/default-avatar.svg'"
            />
            <div>
              <div class="font-medium text-gray-900">{{ review.author.full_name }}</div>
              <div class="text-sm text-gray-500">
                {{ formatDate(review.created_at) }}
                <span v-if="review.updated_at !== review.created_at">
                  (Updated {{ formatDate(review.updated_at) }})
                </span>
              </div>
              <div class="flex items-center text-sm text-gray-500 space-x-4 mt-2">
                <span>
                  <i class="pi pi-eye mr-1"></i>
                  {{ review.views_count }} views
                </span>
                <span>
                  <i class="pi pi-thumbs-up mr-1"></i>
                  {{ review.helpful_count }} found helpful
                </span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="star-rating text-xl mr-4" v-if="review.rating > 1">
              <i class="pi pi-star-fill mr-1"></i>
              {{ review.rating }}
            </div>
            <button
              v-if="user"
              @click="handleStarReview"
              class="btn-secondary"
              :class="{ 'bg-yellow-100': hasUserStarred }"
            >
              <i class="pi pi-star mr-1"></i>
              {{ hasUserStarred ? 'Starred' : 'Star' }}
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="category in review.categories"
            :key="category.id"
            class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
          >
            {{ category.name }}
          </span>
        </div>

        <div v-if="review.ai_generated" class="mb-6">
          <span class="text-blue-600">
            <i class="pi pi-robot mr-1"></i>
            This review was created with AI assistance
          </span>
        </div>
      </div>

      <!-- Review Content -->
      <div class="prose prose-lg max-w-none mb-12">
        <div v-html="renderedContent"></div>
      </div>

      <!-- Comments Section -->
      <div class="border-t pt-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
        
        <!-- Comment Form -->
        <div v-if="user" class="mb-8">
          <textarea
            v-model="newComment"
            class="input-field mb-4"
            rows="4"
            placeholder="Write a comment..."
          ></textarea>
          <button
            @click="handleSubmitComment"
            class="btn-primary"
            :disabled="!newComment.trim()"
          >
            Post Comment
          </button>
        </div>
        <div v-else class="mb-8 text-center">
          <button 
            @click="navigateTo('/auth/login')"
            class="btn-primary border-none"
          >
            Sign in to comment
          </button>
        </div>

        <!-- Comments List -->
        <div class="space-y-6">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="bg-gray-50 rounded-lg p-6"
          >
            <div class="flex items-center mb-4">
              <img
                :src="comment.author.avatar_url || '/default-avatar.svg'"
                :alt="comment.author.full_name"
                class="w-8 h-8 rounded-full mr-3 bg-gray-100"
                @error="$event.target.src = '/default-avatar.svg'"
              />
              <div>
                <div class="font-medium text-gray-900">
                  {{ comment.author.full_name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(comment.created_at) }}
                </div>
              </div>
            </div>
            <p class="text-gray-700">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useAsyncData } from '#app'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useToast } from 'primevue/usetoast'
import { marked } from 'marked'
import { format } from 'date-fns'

const route = useRoute()
const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const review = ref(null)
const comments = ref([])
const newComment = ref('')
const hasUserStarred = ref(false)
const isLoading = ref(true)

console.log('[reviews/[slug]] Initial load - slug:', route.params.slug)

// Fetch review data
const { data } = await useAsyncData(`review-${route.params.slug}`, async () => {
  console.log('[reviews/[slug]] Fetching review data for slug:', route.params.slug)
  const { data, error } = await client
    .from('reviews')
    .select(`
      *,
      author:profiles(*),
      categories(*)
    `)
    .eq('slug', route.params.slug)
    .eq('is_published', true)
    .single()
  
  console.log('[reviews/[slug]] Review fetch result:', { data, error })
  if (error) {
    console.error('[reviews/[slug]] Error fetching review:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load review',
      life: 3000
    })
    return null
  }
  return data
})

review.value = data.value
isLoading.value = false
console.log('[reviews/[slug]] Review value after assignment:', review.value)

// Fetch review by ID with author information
onMounted(async () => {
  console.log('[reviews/[slug]] onMounted - checking review:', review.value)
  if (!review.value) {
    console.log('[reviews/[slug]] No review found, redirecting to search')
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Review not found or is not published',
      life: 5000
    })
    navigateTo('/search')
    return
  }

  // Check if user has starred the review
  if (user.value) {
    console.log('[reviews/[slug]] Checking helpful vote for user:', user.value.id)
    const { data: voteData, error: voteError } = await client
      .from('helpful_votes')
      .select('*')
      .eq('review_id', review.value.id)
      .eq('user_id', user.value.id)
      .single()
    
    console.log('[reviews/[slug]] Vote check result:', { voteData, voteError })
    hasUserStarred.value = !!voteData
  } else {
    console.log('[reviews/[slug]] No user logged in, skipping vote check')
  }
})

// Fetch comments
const { data: commentsData } = await useAsyncData(`comments-${route.params.slug}`, async () => {
  console.log('[reviews/[slug]] Fetching comments for review:', review.value?.id)
  const { data, error } = await client
    .from('comments')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('review_id', review.value?.id)
    .order('created_at', { ascending: false })
  
  console.log('[reviews/[slug]] Comments fetch result:', { data, error })
  return data
})

comments.value = commentsData.value

// Render markdown content
const renderedContent = computed(() => {
  return marked(review.value?.content || '')
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const handleStarReview = async () => {
  console.log('[reviews/[slug]] handleStarReview called - user:', user.value)
  if (!user.value) {
    console.log('[reviews/[slug]] No user logged in, redirecting to login')
    return navigateTo('/auth/login')
  }

  try {
    console.log('[reviews/[slug]] Processing star action - current state:', hasUserStarred.value)
    if (hasUserStarred.value) {
      await client
        .from('helpful_votes')
        .delete()
        .eq('review_id', review.value.id)
        .eq('user_id', user.value.id)
    } else {
      await client
        .from('helpful_votes')
        .insert({
          review_id: review.value.id,
          user_id: user.value.id
        })
    }

    // Update local state
    hasUserStarred.value = !hasUserStarred.value
    
    // Refresh the review to get updated helpful_count
    const { data } = await client
      .from('reviews')
      .select('helpful_count')
      .eq('id', review.value.id)
      .single()
    
    if (data) {
      review.value.helpful_count = data.helpful_count
      console.log('[reviews/[slug]] Updated helpful_count:', data.helpful_count)
    }

  } catch (error) {
    console.error('[reviews/[slug]] Error updating helpful vote:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update helpful vote. Please try again.',
      life: 3000
    })
  }
}

const handleSubmitComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const { data: comment } = await client
      .from('comments')
      .insert({
        review_id: review.value.id,
        user_id: user.value.id,
        content: newComment.value.trim()
      })
      .select(`
        *,
        author:profiles(*)
      `)
      .single()

    comments.value.unshift(comment)
    newComment.value = ''
  } catch (error) {
    console.error('Error posting comment:', error)
  }
}
</script> 