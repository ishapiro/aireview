<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-white">
      <div class="max-w-3xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8">
        <div class="text-center">
          <!-- Headline -->
          <h1 class="text-5xl font-extrabold text-gray-900 leading-tight mb-2 tracking-tight">
            Find the Best Products
          </h1>
          <h2 class="text-2xl font-semibold text-gray-700 mb-6 tracking-tight">
            Instantly or On Demand
          </h2>

          <!-- Subheadline -->
          <p class="text-lg text-gray-500 mb-10 leading-relaxed">
            AI-generated reviews that search, analyze, and summarize insights from across the web —
            giving you a fast, balanced view before you buy.
          </p>
          <!-- Search Bar -->
          <form class="flex justify-center mb-8" @submit.prevent="navigateToSearch">
            <input v-model="searchQuery" type="text" placeholder="Search for a product or category..." class="w-full max-w-md px-4 py-3 rounded-l-lg border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:outline-none text-lg" />
            <button type="submit" class="btn-primary rounded-l-none rounded-r-lg px-6 text-lg">Search</button>
          </form>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <NuxtLink to="/search">
              <Button label="Browse Existing Reviews" size="large" class="w-full sm:w-auto rounded-lg px-8 py-3" />
            </NuxtLink>
            <template v-if="user">
              <UserReviewGenerator />
            </template>
            <template v-else>
              <span v-tooltip="{ value: 'You need a free account and must be signed in to use this feature.', pt: { popper: 'min-w-[250px] max-w-[350px] whitespace-normal text-left' } }">
                <Button 
                  label="Generate New AI Reviews" 
                  size="large" 
                  disabled 
                  class="opacity-50 cursor-not-allowed w-full sm:w-auto rounded-lg px-8 py-3" 
                  icon="pi pi-robot"
                />
              </span>
            </template>
          </div>
          <!-- Affiliate Disclosure -->
          <div class="mt-4 text-xs text-gray-400 max-w-md mx-auto">
            <p>Cogitations Reviews may earn affiliate commissions from links on this site. Our reviews are unbiased and AI-assisted. <NuxtLink to="/about" class="underline hover:text-primary-600">Learn more</NuxtLink>.</p>
          </div>
          <!-- Feature Highlights -->
          <div class="mt-10 max-w-md mx-auto">
            <ul class="space-y-4 text-base text-gray-600 text-left">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-violet-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span>AI reviews scan thousands of product comments, articles, and feedback sources.</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-violet-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span>Get an unbiased overview — not just what's popular on a single site.</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-violet-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span>Use without signing in, or log in to access more personalized features.</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-violet-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span>Generating new reviews takes ~15 seconds per product and is stored for future use.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Reviews -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Latest Reviews</h2>
          <NuxtLink to="/search">
            <Button label="View All" class="rounded-lg px-6 py-2" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ReviewCard
            v-for="review in latestReviews"
            :key="review.id"
            :review="review"
          />
        </div>
      </div>
    </div>

    <!-- Top Rated Products -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Top Rated Products</h2>
          <NuxtLink to="/search?sort=rating&order=desc">
            <Button label="View All" class="rounded-lg px-6 py-2" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ReviewCard
            v-for="review in topRatedReviews"
            :key="review.id"
            :review="review"
          />
        </div>
      </div>
    </div>

    <!-- Popular Categories (Horizontal Scroll) -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Popular Categories</h2>
          <NuxtLink to="/categories" class="btn-primary inline-block">View All Categories</NuxtLink>
        </div>
        <div class="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <NuxtLink
            v-for="category in categories.slice(0,8)"
            :key="category.id"
            :to="`/categories/${category.slug}`"
            class="group min-w-[280px] max-w-xs bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-200 p-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-400 no-underline"
          >
            <div>
              <img
                v-if="category.image_url"
                :src="category.image_url"
                :alt="category.name"
                class="w-full h-40 object-cover rounded-t-xl"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="w-full h-40 bg-gray-200 flex items-center justify-center rounded-t-xl">
                <i class="pi pi-image text-4xl text-gray-400"></i>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{{ category.name }}</h3>
              <p class="text-sm text-gray-500 mb-0 line-clamp-3">{{ category.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- How It Works / Why Trust Us -->
    <div class="bg-white py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">How Cogitations Reviews Works</h2>
        <ul class="space-y-4 text-base text-gray-700">
          <li><span class="font-semibold text-primary-600">1.</span> We scan thousands of product reviews, articles, and feedback sources using advanced AI.</li>
          <li><span class="font-semibold text-primary-600">2.</span> Our system summarizes and analyzes the data to provide unbiased, balanced insights.</li>
          <li><span class="font-semibold text-primary-600">3.</span> You get fast, easy-to-read reviews and can generate new ones on demand.</li>
          <li><span class="font-semibold text-primary-600">4.</span> We may earn affiliate commissions, but our reviews are always independent and AI-assisted.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserReviewGenerator from '~/components/UserReviewGenerator.vue'
import { useCategories } from '~/composables/useCategories'

const client = useSupabaseClient()
const user = useSupabaseUser()
const config = useRuntimeConfig()

const searchQuery = ref('')
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