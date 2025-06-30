<template>
  <div class="max-w-4xl mx-auto px-4 py-4 sm:py-8">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="!review" class="text-center min-h-[400px] flex flex-col justify-center">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Review Not Found</h2>
      <p class="text-sm sm:text-base text-gray-600 mb-8">This review may have been removed or is not published.</p>
      <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">
        Return to Home
      </NuxtLink>
    </div>

    <div v-else class="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 md:p-12">
      <!-- Review Header -->
      <div class="mb-4 sm:mb-6">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2 sm:mb-4">{{ cleanTitle(review.title) }}</h1>
        
        <!-- Action Buttons - Mobile Optimized -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button
            @click="handleAmazonLookup"
            :disabled="isAmazonLoading"
            class="btn-primary inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-lg font-semibold rounded-lg shadow-md border-0 w-full sm:w-auto min-h-[44px] touch-manipulation"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Lookup on Amazon
          </button>
          
          <!-- Helpful Button - Mobile Optimized -->
          <button
            @click="handleStarReview"
            :disabled="!user"
            class="inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-lg font-semibold rounded-lg shadow-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full sm:w-auto min-h-[44px] touch-manipulation"
            :class="{ 'bg-blue-50 border-blue-300 text-blue-700': hasUserStarred }"
          >
            <i class="pi pi-thumbs-up mr-2" :class="{ 'text-blue-600': hasUserStarred }"></i>
            {{ hasUserStarred ? 'Marked Helpful' : 'Mark as Helpful' }}
          </button>
        </div>

        <!-- Metadata - Mobile Optimized -->
        <div class="flex flex-col sm:flex-row sm:items-center text-gray-500 text-xs sm:text-sm mb-2 sm:mb-4 gap-1 sm:gap-0">
          <span>{{ formatDate(review.created_at) }}</span>
          <span class="hidden sm:inline mx-2">·</span>
          <span><i class="pi pi-eye mr-1"></i>{{ review.views_count }} views</span>
          <span class="hidden sm:inline mx-2">·</span>
          <span><i class="pi pi-thumbs-up mr-1"></i>{{ review.helpful_count }} found helpful</span>
        </div>
        
        <!-- Rating - Mobile Optimized -->
        <div class="flex items-center gap-2 mb-3 sm:mb-4">
          <span class="text-yellow-500 text-lg sm:text-xl"><i class="pi pi-star-fill"></i></span>
          <span class="text-base sm:text-lg font-semibold text-gray-800">{{ review.rating?.toFixed(1) || 'N/A' }}</span>
        </div>
        
        <!-- AI Notice - Mobile Optimized -->
        <div class="mb-3 sm:mb-4">
          <span class="text-blue-600 text-xs sm:text-sm">This review was created with AI assistance</span>
        </div>

        <!-- Reviews Consulted Notice -->
        <div v-if="reviewsConsultedCount" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center">
            <i class="pi pi-search text-blue-600 mr-2 sm:mr-3 text-sm sm:text-base"></i>
            <span class="text-blue-800 text-sm sm:text-base font-medium">
              This review consolidated almost {{ reviewsConsultedCount }} reviews found on the web.
            </span>
          </div>
        </div>
      </div>

      <!-- Review Content -->
      <div class="prose max-w-none mb-8 sm:mb-12 prose-headings:font-bold prose-headings:text-gray-900 prose-h1:text-2xl sm:prose-h1:text-3xl prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg sm:prose-h3:text-xl prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-800 prose-li:leading-relaxed prose-li:text-gray-700 prose-ul:pl-4 sm:prose-ul:pl-6 prose-ol:pl-4 sm:prose-ol:pl-6 prose-strong:text-gray-900 prose-strong:font-semibold space-y-4 sm:space-y-6 text-left">
        <div v-html="renderedContent"></div>
      </div>

      <!-- Edit Button for Review Owner or Admin - Mobile Optimized -->
      <div v-if="user?.id === review?.user_id || userProfile?.is_admin" class="mb-6 sm:mb-8 flex justify-end">
        <NuxtLink :to="`/admin/reviews/${review.id}`" class="btn-primary text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-3 min-h-[44px] inline-flex items-center justify-center touch-manipulation">
          <i class="pi pi-pencil mr-2"></i>
          Edit Review
        </NuxtLink>
      </div>
      
      <!-- Debug info (remove in production) -->
      <div v-if="user" class="mb-4 p-2 bg-gray-100 text-xs">
        Debug: User ID: {{ user.id }}, Review User ID: {{ review?.user_id }}, Is Admin: {{ userProfile?.is_admin }}, Show Edit: {{ user?.id === review?.user_id || userProfile?.is_admin }}
      </div>

      <!-- Comments Section -->
      <div class="border-t pt-6 sm:pt-8">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Comments</h2>
        
        <!-- Comment Form - Mobile Optimized -->
        <div v-if="user" class="mb-6 sm:mb-8">
          <textarea
            v-model="newComment"
            class="input-field mb-3 sm:mb-4 text-sm sm:text-base w-full"
            rows="4"
            placeholder="Write a comment..."
          ></textarea>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              @click="handleSubmitComment"
              class="btn-primary text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-3 min-h-[44px] inline-flex items-center justify-center w-full sm:w-auto touch-manipulation"
              :disabled="!newComment.trim()"
            >
              <i class="pi pi-send mr-2"></i>
              Post Comment
            </button>
          </div>
        </div>
        <div v-else class="mb-6 sm:mb-8 text-center">
          <button 
            @click="navigateTo('/auth/login')"
            class="btn-primary text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-3 min-h-[44px] inline-flex items-center justify-center w-full sm:w-auto touch-manipulation"
          >
            <i class="pi pi-sign-in mr-2"></i>
            Sign in to comment
          </button>
        </div>

        <!-- Comments List - Mobile Optimized -->
        <div class="space-y-4 sm:space-y-6">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="bg-gray-50 rounded-lg p-4 sm:p-6"
          >
            <div class="flex items-center mb-3 sm:mb-4">
              <img
                :src="comment.author.avatar_url || '/default-avatar.svg'"
                :alt="comment.author.full_name"
                class="w-8 h-8 sm:w-8 sm:h-8 rounded-full mr-3 bg-gray-100 flex-shrink-0"
                @error="$event.target.src = '/default-avatar.svg'"
              />
              <div class="min-w-0 flex-1">
                <div class="font-medium text-gray-900 text-sm sm:text-base truncate">
                  {{ comment.author.full_name }}
                </div>
                <div class="text-xs sm:text-sm text-gray-500">
                  {{ formatDate(comment.created_at) }}
                </div>
              </div>
            </div>
            <p class="text-gray-700 text-sm sm:text-base break-words">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Amazon Products Dialog - Mobile Optimized -->
    <Dialog
      v-model:visible="showAmazonDialog"
      modal
      header="Amazon Products"
      :style="{ width: '95vw', maxWidth: '800px' }"
      :closable="true"
      class="sm:mx-4"
    >
      <div v-if="amazonProducts.length === 0 && !isAmazonLoading" class="text-center py-6 sm:py-8">
        <p class="text-sm sm:text-base text-gray-600">No products found on Amazon for "{{ review?.title }}"</p>
      </div>
      
      <div v-else-if="isAmazonLoading" class="text-center py-6 sm:py-8">
        <ProgressSpinner />
        <p class="text-sm sm:text-base text-gray-600 mt-4">Searching Amazon...</p>
      </div>
      
      <div v-else class="space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
        <div
          v-for="product in amazonProducts"
          :key="product.ASIN"
          class="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex gap-3 sm:gap-4">
            <div class="flex-shrink-0">
              <img
                v-if="product.Images?.Primary?.Medium?.URL"
                :src="product.Images.Primary.Medium.URL"
                :alt="product.ItemInfo?.Title?.DisplayValue"
                class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
              />
              <div v-else class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded flex items-center justify-center">
                <i class="pi pi-image text-gray-400 text-sm sm:text-base"></i>
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2">
                {{ product.ItemInfo?.Title?.DisplayValue || 'Product Title Not Available' }}
              </h3>
              
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
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
                class="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs sm:text-sm min-h-[32px] touch-manipulation"
              >
                <i class="pi pi-external-link mr-1"></i>
                View on Amazon
              </a>
            </div>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- AI Update Dialog - Mobile Optimized -->
    <Dialog
      v-model:visible="showAIDialog"
      modal
      header="AI Update"
      :style="{ width: '95vw', maxWidth: '600px' }"
      class="sm:mx-4"
    >
      <div class="prose prose-sm sm:prose-lg max-w-none prose-headings:text-sm sm:prose-headings:text-base overflow-x-auto max-h-[60vh] sm:max-h-[70vh] overflow-y-auto" v-html="renderedAIResponse"></div>
      <template #footer>
        <div class="flex justify-end w-full p-4">
          <Button @click="showAIDialog = false" label="Close" class="min-h-[44px] px-4 py-3 touch-manipulation" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useToast } from 'primevue/usetoast'
import { marked } from 'marked'
import { format } from 'date-fns'
import { cleanTitle } from '~/utils/string'
import { useAmazon } from '~/composables/useAmazon'
import { useAI } from '@/composables/useAI'
import { useBreadcrumbs } from '~/composables/useBreadcrumbs'

// PrimeVue components
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

definePageMeta({
  layout: 'default',
  name: 'Review',
  breadcrumb: 'Review'
})

const route = useRoute()
const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const { searchProducts } = useAmazon()
const { sendAIPrompt } = useAI()
const { setBreadcrumbs } = useBreadcrumbs()

const review = ref(null)
const comments = ref([])
const newComment = ref('')
const hasUserStarred = ref(false)
const isLoading = ref(true)
const userProfile = ref(null)

// Amazon lookup state
const showAmazonDialog = ref(false)
const amazonProducts = ref([])
const isAmazonLoading = ref(false)
const isAIUpdating = ref(false)
const showAIDialog = ref(false)
const aiResponse = ref('')

console.log('[reviews/[slug]] Initial load - slug:', route.params.slug)
console.log('[reviews/[slug]] User object:', user.value)

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
  
  // Fetch user profile if user is logged in
  if (user.value) {
    try {
      const { data: profileData, error: profileError } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()
      
      if (profileError) {
        console.error('[reviews/[slug]] Error fetching user profile:', profileError)
      } else {
        userProfile.value = profileData
        console.log('[reviews/[slug]] User profile:', userProfile.value)
      }
    } catch (error) {
      console.error('[reviews/[slug]] Exception fetching user profile:', error)
    }
  }
  
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

// Extract number of reviews consulted
const reviewsConsultedCount = computed(() => {
  if (!review.value?.content) return null
  
  const content = review.value.content
  const reviewsConsultedMatch = content.match(/REVIEWS CONSULTED:\s*(\d+)/i)
  
  if (reviewsConsultedMatch) {
    const count = parseInt(reviewsConsultedMatch[1])
    // Only return the count if it's greater than zero
    return count > 0 ? count : null
  }
  
  return null
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

// Update breadcrumb when review is loaded
watch(review, (newReview) => {
  if (newReview) {
    setBreadcrumbs([
      {
        label: 'Reviews',
        to: '/reviews'
      },
      {
        label: newReview.title || 'Review'
      }
    ])
  }
}, { immediate: true })
</script> 