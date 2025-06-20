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
  // First, fetch the category to ensure it exists
  const { data: categoryData, error: categoryError } = await client
    .from('categories')
    .select('*')
    .eq('slug', route.params.slug)
    .single()

  // If the category doesn't exist, we can stop here.
  if (categoryError) {
    console.error('Error fetching category:', categoryError)
    return { category: null, reviews: [] }
  }

  // Then, fetch all published reviews linked to this category
  const { data: reviewsData, error: reviewsError } = await client
    .from('review_categories')
    .select(`
      review:reviews!inner(
        *,
        author:profiles(full_name, avatar_url),
        categories:review_categories(categories(id, name, slug))
      )
    `)
    .eq('category_id', categoryData.id)
    .eq('review.is_published', true)
    .order('created_at', { referencedTable: 'reviews', ascending: false });


  if (reviewsError) {
    console.error('Error fetching reviews for category:', reviewsError)
    // We still have the category data, so we can show the page with an empty review list.
    return { category: categoryData, reviews: [] }
  }

  // The query returns review_categories objects, so we need to extract the review from each
  const fetchedReviews = reviewsData.map(item => {
    const review = item.review;
    if (review && Array.isArray(review.categories)) {
      review.categories = review.categories.map(c => c.categories).filter(Boolean);
    }
    return review;
  }).filter(Boolean);


  return { category: categoryData, reviews: fetchedReviews }
})

// Update the refs with the fetched data
if (data.value) {
  category.value = data.value.category
  reviews.value = data.value.reviews
}

isLoading.value = false
</script> 