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
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <NuxtLink to="/search">
              <Button label="Browse Existing Reviews" size="large" class="w-full sm:w-auto rounded-lg px-8 py-3" />
            </NuxtLink>
            <template v-if="user">
              <UserReviewGenerator />
            </template>
            <template v-else>
              <span v-tooltip.top="'You need an account and must be logged in to use this feature.'">
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

    <!-- Featured Categories -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Popular Categories</h2>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="category in categories" :key="category.id" class="hover:shadow-xl transition-shadow rounded-xl p-6 bg-white">
            <template #header>
              <img 
                v-if="category.image_url" 
                :src="category.image_url" 
                :alt="category.name" 
                class="w-full h-48 object-cover rounded-t-xl"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-xl">
                <i class="pi pi-image text-4xl text-gray-400"></i>
              </div>
            </template>
            <template #title>
              <span class="text-lg font-semibold text-gray-800">{{ category.name }}</span>
            </template>
            <template #content>
              <p class="text-gray-500">{{ category.description }}</p>
            </template>
            <template #footer>
              <NuxtLink :to="`/categories/${category.slug}`">
                <Button label="View Reviews" class="rounded-lg px-6 py-2" />
              </NuxtLink>
            </template>
          </Card>
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
  </div>
</template>

<script setup>
import UserReviewGenerator from '~/components/UserReviewGenerator.vue'

const client = useSupabaseClient()
const user = useSupabaseUser()
const config = useRuntimeConfig()

// Fetch categories
const { data: categories } = await useAsyncData('categories', async () => {
  const { data } = await client
    .from('categories_with_review_count')
    .select('*')
    .order('review_count', { ascending: false })
  return data
})

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