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

    <div v-else class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <!-- Review Header -->
      <div class="mb-4">
        <h1 class="text-4xl font-extrabold text-gray-900 leading-tight mb-2">{{ cleanTitle(review.title) }}</h1>
        <div class="flex items-center gap-4 mb-6">
          <button
            @click="handleAmazonLookup"
            :disabled="isAmazonLoading"
            class="inline-flex items-center px-6 py-3 text-lg font-semibold rounded-lg bg-violet-600 text-white shadow-md hover:bg-violet-700 transition focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Lookup on Amazon
          </button>
          <span class="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">Best Price</span>
        </div>
        <div class="flex items-center text-gray-500 text-sm mb-2">
          <span>{{ formatDate(review.created_at) }}</span>
          <span class="mx-2">·</span>
          <span><i class="pi pi-eye mr-1"></i>{{ review.views_count }} views</span>
          <span class="mx-2">·</span>
          <span><i class="pi pi-thumbs-up mr-1"></i>{{ review.helpful_count }} found helpful</span>
        </div>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-yellow-500 text-xl"><i class="pi pi-star-fill"></i></span>
          <span class="text-lg font-semibold text-gray-800">{{ review.rating?.toFixed(1) || 'N/A' }}</span>
        </div>
        <div class="mb-4">
          <span class="text-blue-600 text-sm">This review was created with AI assistance</span>
        </div>
      </div>

      <!-- Review Content -->
      <div class="prose max-w-none mb-12 prose-headings:font-bold prose-headings:text-gray-900 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-800 prose-li:leading-relaxed prose-li:text-gray-700 prose-ul:pl-6 prose-ol:pl-6 prose-strong:text-gray-900 prose-strong:font-semibold space-y-6 text-left">
        <div v-html="renderedContent"></div>
      </div>

      <!-- Edit Button for Review Owner -->
      <div v-if="user?.id === review?.user_id" class="mb-8 flex justify-end">
        <NuxtLink :to="`/admin/reviews/${review.id}`" class="btn-primary">
          <i class="pi pi-pencil mr-2"></i>
          Edit Review
        </NuxtLink>
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

    <!-- Amazon Products Dialog -->
    <Dialog
      v-model:visible="showAmazonDialog"
      modal
      header="Amazon Products"
      :style="{ width: '80vw', maxWidth: '800px' }"
      :closable="true"
    >
      <div v-if="amazonProducts.length === 0 && !isAmazonLoading" class="text-center py-8">
        <p class="text-gray-600">No products found on Amazon for "{{ review?.title }}"</p>
      </div>
      
      <div v-else-if="isAmazonLoading" class="text-center py-8">
        <ProgressSpinner />
        <p class="text-gray-600 mt-4">Searching Amazon...</p>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="product in amazonProducts"
          :key="product.ASIN"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <img
                v-if="product.Images?.Primary?.Medium?.URL"
                :src="product.Images.Primary.Medium.URL"
                :alt="product.ItemInfo?.Title?.DisplayValue"
                class="w-20 h-20 object-cover rounded"
              />
              <div v-else class="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                <i class="pi pi-image text-gray-400"></i>
              </div>
            </div>
            
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 mb-2">
                {{ product.ItemInfo?.Title?.DisplayValue || 'Product Title Not Available' }}
              </h3>
              
              <div class="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span v-if="product.CustomerReviews?.StarRating?.Value">
                  <i class="pi pi-star-fill text-yellow-400 mr-1"></i>
                  {{ product.CustomerReviews.StarRating.Value }} ({{ product.CustomerReviews.Count || 0 }} reviews)
                </span>
                <span v-if="product.Offers?.Listings?.[0]?.Price?.DisplayAmount">
                  <i class="pi pi-dollar mr-1"></i>
                  {{ product.Offers.Listings[0].Price.DisplayAmount }}
                </span>
              </div>
              
              <a
                :href="product.affiliateLink"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <i class="pi pi-external-link mr-1"></i>
                View on Amazon
              </a>
            </div>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- AI Update Dialog -->
    <Dialog
      v-model:visible="showAIDialog"
      modal
      header="AI Update"
      :style="{ width: '600px', maxWidth: '90vw' }"
    >
      <div class="prose prose-lg max-w-none text-sm prose-headings:text-base" v-html="renderedAIResponse"></div>
      <template #footer>
        <Button @click="showAIDialog = false" label="Close" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useToast } from 'primevue/usetoast'
import { marked } from 'marked'
import { format } from 'date-fns'
import { cleanTitle } from '~/utils/string'
import { useAmazon } from '~/composables/useAmazon'
import { useAI } from '@/composables/useAI'

// PrimeVue components
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

const route = useRoute()
const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const { searchProducts } = useAmazon()
const { sendAIPrompt } = useAI()

const review = ref(null)
const comments = ref([])
const newComment = ref('')
const hasUserStarred = ref(false)
const isLoading = ref(true)

// Amazon lookup state
const showAmazonDialog = ref(false)
const amazonProducts = ref([])
const isAmazonLoading = ref(false)
const isAIUpdating = ref(false)
const showAIDialog = ref(false)
const aiResponse = ref('')

console.log('[reviews/[slug]] Initial load - slug:', route.params.slug)

// Fetch review data
const { data } = await useAsyncData(`review-${route.params.slug}`, async () => {
  console.log('[reviews/[slug]] Fetching review data for slug:', route.params.slug)
  const { data, error } = await client
    .from('reviews')
    .select(`
      *,
      author:profiles(*),
      categories:review_categories(categories(id, name, slug))
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
  
  if (data) {
    data.categories = data.categories.map(c => c.categories)
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

  // Increment view count
  try {
    const { error: updateError } = await client
      .rpc('increment_view_count', { review_id: review.value.id })
    
    if (updateError) {
      console.error('[reviews/[slug]] Error incrementing view count:', updateError)
    } else {
      // Update local view count
      review.value.views_count += 1
    }
  } catch (error) {
    console.error('[reviews/[slug]] Error incrementing view count:', error)
  }

  // Check if user has starred the review
  if (user.value) {
    try {
      const { data: voteData, error: voteError } = await client
        .from('helpful_votes')
        .select('*')
        .eq('review_id', review.value.id)
        .eq('user_id', user.value.id)
        .maybeSingle()
      
      if (voteError) {
        console.error('[reviews/[slug]] Error checking helpful vote:', voteError)
      }
      
      hasUserStarred.value = !!voteData
    } catch (error) {
      console.error('[reviews/[slug]] Exception during vote check:', error)
    }
  }

  // Log the review view
  if (process.client && data.value?.category) {
    const { error } = await client.rpc('log_user_activity', {
      activity_type: 'review_view',
      activity_metadata: {
        review_id: data.value.category.id,
        review_slug: data.value.category.slug
      }
    })
    if (error) {
      console.error('Error logging review view:', error)
    }
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

const renderedAIResponse = computed(() => marked(aiResponse.value || ''))

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

// Amazon lookup functionality
const handleAmazonLookup = async () => {
  if (!review.value?.title) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No product title available for search',
      life: 3000
    })
    return
  }

  isAmazonLoading.value = true
  showAmazonDialog.value = true
  amazonProducts.value = []

  try {
    const searchTerm = cleanTitle(review.value.title)
    console.log('[reviews/[slug]] Searching Amazon for:', searchTerm)
    
    const result = await searchProducts(searchTerm)
    
    if (result.SearchResult?.Items) {
      amazonProducts.value = result.SearchResult.Items
      console.log('[reviews/[slug]] Found Amazon products:', amazonProducts.value.length)
    } else {
      console.log('[reviews/[slug]] No Amazon products found')
    }
  } catch (error) {
    console.error('[reviews/[slug]] Amazon lookup error:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to search Amazon products. Please try again.',
      life: 3000
    })
  } finally {
    isAmazonLoading.value = false
  }
}

const handleUpdateWithAI = async () => {
  if (!review.value?.title) return
  isAIUpdating.value = true
  try {
    const prompt = `Update: ${review.value.title}`
    const response = await sendAIPrompt(prompt)
    aiResponse.value = response
    showAIDialog.value = true
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'AI Error',
      detail: 'Failed to update with AI',
      life: 4000
    })
  } finally {
    isAIUpdating.value = false
  }
}
</script> 