<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find the Best AI Focused Software for your Business
          </h1>
          <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            AI based, and human augmented, reviews. Make informed decisions.
          </p>
          <div class="mt-8 flex justify-center">
            <NuxtLink to="/search">
              <Button label="Search Saved Reviews" size="large" />
            </NuxtLink>
          </div>
          <div class="mt-8 flex justify-center" v-if="user">
            <UserReviewGenerator />
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Categories -->
    <div class="bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="category in categories" :key="category.id" class="hover:shadow-lg transition-shadow">
            <template #header>
              <img 
                v-if="category.image_url" 
                :src="category.image_url" 
                :alt="category.name" 
                class="w-full h-48 object-cover"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
                <i class="pi pi-image text-4xl text-gray-400"></i>
              </div>
            </template>
            <template #title>
              {{ category.name }}
            </template>
            <template #content>
              <p class="text-gray-500">{{ category.description }}</p>
            </template>
            <template #footer>
              <NuxtLink :to="`/categories/${category.slug}`">
                <Button label="View Reviews" />
              </NuxtLink>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- Latest Reviews -->
    <div class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Latest Reviews</h2>
          <NuxtLink to="/search">
            <Button label="View All"  />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ReviewCard
            v-for="review in latestReviews"
            :key="review.id"
            :review="review"
          />
        </div>
      </div>
    </div>

    <!-- Top Rated Products -->
    <div class="bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Top Rated Products</h2>
          <NuxtLink to="/search?sort=rating&order=desc">
            <Button label="View All"  />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    .from('categories')
    .select('*')
    .order('name')
  
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