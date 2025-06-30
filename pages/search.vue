<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Search Existing Reviews</h1>
    <p class="text-sm text-gray-500 mb-6 max-w-2xl">
      Want a review that doesn't exist yet? <span class="font-medium text-primary-600">Registered users</span> can generate new AI-powered reviews for any product in seconds.
    </p>

    <!-- Search Form -->
    <Card class="mb-8">
      <template #content>
        <form @submit.prevent="handleSearch" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="field">
              <label for="query" class="block text-sm font-medium text-gray-700">Search</label>
              <SearchInput
                v-model="searchForm.query"
                :categories="categories"
                @search="handleSearch"
                placeholder="Search reviews..."
              />
            </div>

            <div class="field">
              <label for="category" class="block text-sm font-medium text-gray-700">Tag</label>
              <MultiSelect
                id="category"
                v-model="searchForm.category_ids"
                :options="categories"
                optionLabel="name"
                optionValue="id"
                placeholder="All Tags"
                class="w-full"
                display="chip"
              />
            </div>

            <div class="field">
              <label for="rating" class="block text-sm font-medium text-gray-700">Rating</label>
              <Dropdown
                id="rating"
                v-model="searchForm.rating"
                :options="ratingOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Any Rating"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="sort" class="block text-sm font-medium text-gray-700">Sort By</label>
              <Dropdown
                id="sort"
                v-model="searchForm.sort"
                :options="sortOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <Button
              type="submit"
              :loading="isSearching"
              label="Search"
            />
          </div>
        </form>
      </template>
    </Card>

    <!-- Search Results -->
    <div v-if="matchedCategories.length > 0 || searchResults.length > 0">
      <div v-if="matchedCategories.length > 0" class="mb-10">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Matching Tags</h3>
        <div class="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <NuxtLink
            v-for="category in matchedCategories"
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
    <div v-if="searchResults.length > 0">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Matching Reviews</h3>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ReviewCard
          v-for="review in searchResults"
          :key="review.id"
          :review="review"
        />
      </div>
      <!-- Pagination -->
      <div class="mt-8 flex justify-center">
                  <Paginator
            v-model:first="paginatorFirst"
            :rows="12"
            :totalRecords="totalResults"
            @page="onPageChange"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          />
        </div>
      </div>
    </div>

    <!-- No Results -->
    <Card v-else-if="hasSearched" class="text-center py-12">
      <template #content>
        <div class="text-gray-500">
          <i class="pi pi-search text-4xl mb-4"></i>
          <p class="text-lg font-semibold mb-2">No saved review found for your search.</p>
          <p class="mb-2">Savta uses advanced AI to scan thousands of reviews, articles, and ratings across the web — analyzing and summarizing them into clear, balanced insights. Don't rely on a single source. Get the full picture before you buy.</p>
          <p class="mt-4">Create a <span class='font-semibold text-primary-600'>free account</span> and sign in to generate a review for a product that is currently not in our database.</p>
        </div>
      </template>
    </Card>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import MultiSelect from 'primevue/multiselect'
import { useCategories } from '~/composables/useCategories'
import SearchInput from '~/components/SearchInput.vue'
import { normalizeText } from '~/utils/string'

const client = useSupabaseClient()
const route = useRoute()
const router = useRouter()

const searchForm = ref({
  query: '',
  category_ids: [],
  rating: null,
  sort: 'created_at',
  order: 'desc'
})

const searchResults = ref([])
const matchedCategories = ref([])
const currentPage = ref(1)
const totalResults = ref(0)
const isSearching = ref(false)
const hasSearched = ref(false)

const paginatorFirst = computed({
  get: () => (currentPage.value - 1) * 12,
  set: (val) => {
    currentPage.value = Math.floor(val / 12) + 1
  }
})

// Fetch categories for dropdown
const { data: categories } = useCategories()

// Rating options for dropdown
const ratingOptions = [
  { label: 'Any Rating', value: null },
  { label: '4 Stars & Up', value: 4 },
  { label: '3 Stars & Up', value: 3 },
  { label: '2 Stars & Up', value: 2 },
  { label: '1 Star & Up', value: 1 }
]

// Sort options for dropdown
const sortOptions = [
  { label: 'Newest First', value: 'created_at' },
  { label: 'Oldest First', value: 'created_at_asc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Lowest Rated', value: 'rating_asc' },
  { label: 'Most Helpful', value: 'helpful_count' }
]

// Handle search form submission
const handleSearch = () => {
  currentPage.value = 1
  fetchResults()
}

// Handle pagination
const onPageChange = (event) => {
  currentPage.value = Math.floor(event.first / 12) + 1
  fetchResults()
}

// Fetch search results (categories + reviews)
const fetchResults = async () => {
  isSearching.value = true
  hasSearched.value = true

  try {
    // 1. Find matching categories (case-insensitive, partial match, normalized)
    if (searchForm.value.query && categories.value) {
      const q = normalizeText(searchForm.value.query.trim())
      matchedCategories.value = categories.value.filter(cat =>
        normalizeText(cat.name).includes(q)
      )
    } else {
      matchedCategories.value = []
    }

    // 2. Find matching reviews/products as before
    let query = client
      .from('reviews')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url),
        categories:review_categories(categories(id, name, slug))
      `, { count: 'exact' })

    // Apply filters
    if (searchForm.value.query) {
      query = query.or(`title.ilike.%${searchForm.value.query}%,content.ilike.%${searchForm.value.query}%`)
    }

    query = query.eq('is_published', true)

    if (searchForm.value.category_ids && searchForm.value.category_ids.length > 0) {
      query = query.in('review_categories.category_id', searchForm.value.category_ids)
    }

    if (searchForm.value.rating) {
      query = query.gte('rating', searchForm.value.rating)
    }

    // Apply sorting
    const [sortField, order] = searchForm.value.sort.split('_')
    query = query.order(sortField === 'created' ? 'created_at' : sortField, { ascending: order === 'asc' })

    // Apply pagination
    const from = (currentPage.value - 1) * 12
    const to = from + 11
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      console.error('Error fetching search results:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch search results. Please try again.',
        life: 3000
      })
      return
    }

    searchResults.value = data.map(r => ({ ...r, categories: r.categories.map(c => c.categories) })) || []
    totalResults.value = count || 0

    // Log the search event
    if (searchForm.value.query.trim()) {
      const { error: logError } = await client.rpc('log_user_activity', {
        activity_type: 'db_search',
        activity_metadata: { search_query: searchForm.value.query.trim() }
      })
      if (logError) {
        console.error('Error logging search event:', logError)
      }
    }
  } finally {
    isSearching.value = false
  }
}

// Initialize search from URL parameters
onMounted(() => {
  const { query, category_ids, rating, sort } = route.query
  
  if (query) searchForm.value.query = query
  if (category_ids) {
    const ids = Array.isArray(category_ids) ? category_ids : [category_ids]
    searchForm.value.category_ids = ids
  }
  if (rating) searchForm.value.rating = parseInt(rating)
  if (sort) searchForm.value.sort = sort

  if (Object.keys(route.query).length > 0) {
    fetchResults()
  }
})

// Update URL when search parameters change
watch(searchForm, (newValue) => {
  const query = { ...newValue }
  if (!query.category_ids || query.category_ids.length === 0) delete query.category_ids
  if (!query.rating) delete query.rating
  if (!query.query) delete query.query
  if (query.sort === 'created_at') delete query.sort

  router.push({ query })
}, { deep: true })

// Clear category
const clearCategory = () => {
  searchForm.value.category_ids = []
}
</script> 