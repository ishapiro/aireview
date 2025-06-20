<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div v-if="category" class="mb-12">
      <!-- Category Header -->
      <div class="flex items-center mb-8">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900">{{ category.name }}</h1>
          <p class="mt-2 text-lg text-gray-500">{{ category.description }}</p>
        </div>
        <div v-if="category.image_url" class="ml-8">
          <img 
            :src="category.image_url" 
            :alt="category.name"
            class="w-32 h-32 object-cover rounded-lg"
            @error="$event.target.style.display = 'none'"
          />
        </div>
      </div>

      <!-- Reviews Grid -->
      <div v-if="reviews.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ReviewCard
          v-for="review in reviews"
          :key="review.id"
          :review="review"
        />
      </div>
      <Card v-else class="text-center py-12">
        <template #content>
          <div class="text-gray-500">
            <i class="pi pi-file-edit text-4xl mb-4"></i>
            <p class="text-lg">No reviews in this category yet.</p>
            <p class="mt-2">Check back later for new reviews.</p>
          </div>
        </template>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="flex justify-center items-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
      <p class="text-lg text-gray-500 mb-8">The category you're looking for doesn't exist.</p>
      <NuxtLink to="/" class="btn-primary">
        Return Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const client = useSupabaseClient()

const category = ref(null)
const reviews = ref([])
const isLoading = ref(true)

// Fetch category and its reviews
const { data } = await useAsyncData('category-' + route.params.slug, async () => {
  // Fetch the category with its associated reviews
  const { data: categoryData, error } = await client
    .from('categories')
    .select(`
      *,
      reviews:review_categories!inner(
        review:reviews!inner(
          *,
          author:profiles(full_name, avatar_url),
          categories:review_categories(categories(id, name, slug))
        )
      )
    `)
    .eq('slug', route.params.slug)
    .eq('reviews.review.is_published', true)
    .single()

  if (error) {
    console.error('Error fetching category and reviews:', error)
    return { category: null, reviews: [] }
  }

  // Extract and process reviews
  const fetchedReviews = categoryData.reviews.map(r => {
    const review = r.review
    review.categories = review.categories.map(c => c.categories)
    return review
  })

  // Sort reviews by creation date
  fetchedReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // The category data no longer needs the reviews array attached
  delete categoryData.reviews;

  return { category: categoryData, reviews: fetchedReviews }
})

// Update the refs with the fetched data
if (data.value) {
  category.value = data.value.category
  reviews.value = data.value.reviews
}

isLoading.value = false
</script> 