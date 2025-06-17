<template>
  <div class="max-w-4xl mx-auto">
    <!-- Review Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ review.title }}</h1>
      
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <img
            :src="review.author.avatar_url"
            :alt="review.author.full_name"
            class="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div class="font-medium text-gray-900">{{ review.author.full_name }}</div>
            <div class="text-sm text-gray-500">
              {{ formatDate(review.created_at) }}
              <span v-if="review.updated_at !== review.created_at">
                (Updated {{ formatDate(review.updated_at) }})
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center">
          <div class="star-rating text-xl mr-4">
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
        <NuxtLink to="/auth/login" class="btn-primary">
          Sign in to comment
        </NuxtLink>
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
              :src="comment.author.avatar_url"
              :alt="comment.author.full_name"
              class="w-8 h-8 rounded-full mr-3"
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
</template>

<script setup>
import { marked } from 'marked'
import { format } from 'date-fns'

const route = useRoute()
const client = useSupabaseClient()
const user = useSupabaseUser()

const review = ref(null)
const comments = ref([])
const newComment = ref('')
const hasUserStarred = ref(false)

// Fetch review data
const { data } = await useAsyncData(`review-${route.params.slug}`, async () => {
  const { data } = await client
    .from('reviews')
    .select(`
      *,
      author:profiles(*),
      categories(*)
    `)
    .eq('slug', route.params.slug)
    .single()
  
  return data
})

review.value = data.value

// Fetch comments
const { data: commentsData } = await useAsyncData(`comments-${route.params.slug}`, async () => {
  const { data } = await client
    .from('comments')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('review_id', review.value.id)
    .order('created_at', { ascending: false })
  
  return data
})

comments.value = commentsData.value

// Check if user has starred the review
if (user.value) {
  const { data: starData } = await client
    .from('review_stars')
    .select('*')
    .eq('review_id', review.value.id)
    .eq('user_id', user.value.id)
    .single()
  
  hasUserStarred.value = !!starData
}

// Render markdown content
const renderedContent = computed(() => {
  return marked(review.value?.content || '')
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const handleStarReview = async () => {
  if (!user.value) {
    navigateTo('/auth/login')
    return
  }

  try {
    if (hasUserStarred.value) {
      await client
        .from('review_stars')
        .delete()
        .eq('review_id', review.value.id)
        .eq('user_id', user.value.id)
    } else {
      await client
        .from('review_stars')
        .insert({
          review_id: review.value.id,
          user_id: user.value.id
        })
    }
    
    hasUserStarred.value = !hasUserStarred.value
  } catch (error) {
    console.error('Error toggling star:', error)
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