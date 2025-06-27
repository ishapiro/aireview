<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-white">
      <div class="max-w-3xl mx-auto py-12 px-4 sm:py-20 sm:px-6 lg:px-8 lg:py-28">
        <div class="text-center">
          <!-- Headline -->
          <div class="flex items-center justify-center gap-2 mb-2">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Find the Best Products
            </h1>
            <button @click="showInfo = true" class="ml-2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center focus:outline-none border-none bg-transparent p-0" aria-label="How Cogitations Reviews Works">
              <i class="pi pi-info-circle text-xl sm:text-2xl text-primary-600 hover:text-primary-700 focus:text-primary-800 transition-colors"></i>
            </button>
          </div>
          <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6 tracking-tight">
            Instantly or On Demand
          </h2>

          <!-- Subheadline -->
          <p class="text-base sm:text-lg text-gray-500 mb-6 sm:mb-10 leading-relaxed">
            AI-generated reviews that search, analyze, and summarize insights from across the web —
            giving you a fast, balanced view before you buy.
          </p>
          <!-- Search Bar -->
          <form class="flex flex-col items-center gap-3 sm:gap-4 mb-4 w-full max-w-2xl mx-auto" @submit.prevent="navigateToSearch">
            <div class="flex flex-col sm:flex-row w-full gap-2 sm:gap-0">
              <input v-model="searchQuery" type="text" placeholder="Search for a product or category..." class="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:outline-none text-base sm:text-lg" />
              <button type="submit" class="btn-primary rounded-lg sm:rounded-l-none sm:rounded-r-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-semibold w-full sm:w-auto">Search</button>
            </div>
            <div class="w-full">
              <template v-if="user">
                <UserReviewGenerator />
              </template>
              <template v-else>
                <span v-tooltip="{ value: 'You need a free account and must be signed in to use this feature.', pt: { popper: 'min-w-[250px] max-w-[350px] whitespace-normal text-left' } }" class="block w-full">
                  <Button 
                    label="Generate New AI Reviews" 
                    size="large" 
                    disabled 
                    class="btn-primary opacity-50 cursor-not-allowed w-full text-sm sm:text-lg font-semibold py-2 sm:py-3 rounded-lg mt-2" 
                    icon="pi pi-robot"
                  />
                </span>
                <p class="text-xs text-gray-500 text-center mt-2 sm:hidden">Sign up for free and sign in to use this feature.</p>
              </template>
            </div>
          </form>
          <!-- Affiliate Disclosure -->
          <div class="mt-4 text-xs text-gray-400 max-w-md mx-auto px-2">
            <p>Cogitations Reviews may earn affiliate commissions from links on this site. Our reviews are unbiased and AI-assisted. <NuxtLink to="/about" class="underline hover:text-primary-600">Learn more</NuxtLink>.</p>
          </div>
          <!-- Feature Highlights -->
          <div class="mt-8 sm:mt-10 max-w-md mx-auto px-2">
            <ul class="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 text-left">
              <li class="flex items-start gap-2 sm:gap-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-violet-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span>Our AI reviews scan thousands of product comments, articles, and feedback sources.</span>
              </li>
              <li class="flex items-start gap-2 sm:gap-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-violet-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span>Get an unbiased overview — not just what's popular on a single site.</span>
              </li>
              <li class="flex items-start gap-2 sm:gap-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-violet-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span>Use without signing in, or log in to access more personalized features.</span>
              </li>
              <li class="flex items-start gap-2 sm:gap-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-violet-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span>Generating new reviews takes ~15 seconds per product and is stored for future use.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Reviews -->
    <div class="bg-white py-12 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Latest Reviews</h2>
          <NuxtLink to="/search">
            <Button label="View All" class="rounded-lg px-4 sm:px-6 py-2 text-sm sm:text-base" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ReviewCard
            v-for="review in latestReviews"
            :key="review.id"
            :review="review"
          />
        </div>
      </div>
    </div>

    <!-- Top Rated Products -->
    <div class="bg-gray-50 py-12 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Top Rated Products</h2>
          <NuxtLink to="/search?sort=rating&order=desc">
            <Button label="View All" class="rounded-lg px-4 sm:px-6 py-2 text-sm sm:text-base" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ReviewCard
            v-for="review in topRatedReviews"
            :key="review.id"
            :review="review"
          />
        </div>
      </div>
    </div>

    <!-- Popular Categories (Horizontal Scroll) -->
    <div class="bg-gray-50 py-12 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Popular Categories</h2>
          <NuxtLink to="/categories" class="btn-primary inline-block text-sm sm:text-base px-4 sm:px-6 py-2">View All Categories</NuxtLink>
        </div>
        <div class="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <NuxtLink
            v-for="category in categories.slice(0,8)"
            :key="category.id"
            :to="`/categories/${category.slug}`"
            class="group min-w-[240px] sm:min-w-[280px] max-w-xs bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-200 p-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-400 no-underline"
          >
            <div>
              <img
                v-if="category.image_url"
                :src="category.image_url"
                :alt="category.name"
                class="w-full h-32 sm:h-40 object-cover rounded-t-xl"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="w-full h-32 sm:h-40 bg-gray-200 flex items-center justify-center rounded-t-xl">
                <i class="pi pi-image text-3xl sm:text-4xl text-gray-400"></i>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{{ category.name }}</h3>
              <p class="text-xs sm:text-sm text-gray-500 mb-0 line-clamp-3">{{ category.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Info Modal -->
    <Dialog v-model:visible="showInfo" modal header="How Cogitations Reviews Works" :style="{ width: '90vw', maxWidth: '700px' }">
      <ul class="space-y-4 text-base text-gray-700 list-disc pl-6">
        <li>We scan thousands of product reviews, articles, and feedback sources using advanced AI.</li>
        <li>Our system summarizes and analyzes the data to provide unbiased, balanced insights.</li>
        <li>You get fast, easy-to-read reviews and can generate new ones on demand.</li>
        <li>We may earn affiliate commissions, but our reviews are always independent and AI-assisted.</li>
      </ul>
      <template #footer>
        <Button @click="showInfo = false" label="Close" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserReviewGenerator from '~/components/UserReviewGenerator.vue'
import { useCategories } from '~/composables/useCategories'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const client = useSupabaseClient()
const user = useSupabaseUser()
const config = useRuntimeConfig()

const searchQuery = ref('')
const showInfo = ref(false)
const navigateToSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?query=${encodeURIComponent(searchQuery.value.trim())}`)
  } else {
    navigateTo('/search')
  }
}

// Fetch categories
const { data: categories } = useCategories()

// Fetch latest reviews
const { data: latestReviews } = await useAsyncData('latest-reviews', async () => {
  const { data } = await client
    .from('reviews')
    .select(`
      *,
      profiles:user_id (full_name, avatar_url),
      categories:review_categories(categories(id, name, slug))
    `)
    .order('created_at', { ascending: false })
    .limit(6)
  
  return data.map(r => ({ ...r, categories: r.categories.map(c => c.categories) }))
})

// Fetch top rated reviews
const { data: topRatedReviews } = await useAsyncData('top-rated-reviews', async () => {
  const { data } = await client
    .from('reviews')
    .select(`
      *,
      profiles:user_id (full_name, avatar_url),
      categories:review_categories(categories(id, name, slug))
    `)
    .order('rating', { ascending: false })
    .limit(6)
  
  return data.map(r => ({ ...r, categories: r.categories.map(c => c.categories) }))
})
</script> 