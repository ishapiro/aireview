<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div v-if="category" class="mb-8 sm:mb-12">
        <!-- Category Header - Mobile Optimized -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-8">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{{ category.name }}</h1>
            <p class="mt-2 text-base sm:text-lg text-gray-500 break-words">{{ category.description }}</p>
          </div>
          <div v-if="category.image_url" class="flex-shrink-0">
            <img 
              :src="category.image_url" 
              :alt="category.name"
              class="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
              @error="$event.target.style.display = 'none'"
            />
          </div>
        </div>

        <!-- Reviews Grid - Mobile Optimized -->
        <div v-if="reviews.length > 0" class="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ReviewCard
            v-for="review in reviews"
            :key="review.id"
            :review="review"
          />
        </div>
        <Card v-else class="text-center py-8 sm:py-12">
          <template #content>
            <div class="text-gray-500 px-4 sm:px-0">
              <i class="pi pi-file-edit text-3xl sm:text-4xl mb-4"></i>
              <p class="text-base sm:text-lg">No reviews in this category yet.</p>
              <p class="mt-2 text-sm sm:text-base">Check back later for new reviews.</p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Loading State - Mobile Optimized -->
      <div v-else-if="isLoading" class="flex justify-center items-center py-8 sm:py-12">
        <i class="pi pi-spin pi-spinner text-3xl sm:text-4xl text-gray-400"></i>
      </div>

      <!-- Not Found State - Mobile Optimized -->
      <div v-else class="text-center py-8 sm:py-12 px-4 sm:px-0">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <p class="text-base sm:text-lg text-gray-500 mb-6 sm:mb-8">The category you're looking for doesn't exist.</p>
        <NuxtLink to="/" class="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-semibold rounded-lg shadow-md border-0 min-h-[44px] touch-manipulation">
          <i class="pi pi-home mr-2"></i>
          Return Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategories } from '~/composables/useCategories'
import { useBreadcrumbs } from '~/composables/useBreadcrumbs'

const route = useRoute()

definePageMeta({
  layout: 'default',
  name: 'Category',
  breadcrumb: 'Category'
})

console.log('DEBUG: [slug].vue loaded for slug:', route.params.slug)
const client = useSupabaseClient()
const { setBreadcrumbs } = useBreadcrumbs()

const category = ref(null)
const reviews = ref([])
const isLoading = ref(true)

// Update breadcrumb when category is loaded
watch(category, (newCategory) => {
  if (newCategory) {
    setBreadcrumbs([
      {
        label: 'Categories',
        to: '/categories-all'
      },
      {
        label: newCategory.name || 'Category'
      }
    ])
  }
}, { immediate: true })

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