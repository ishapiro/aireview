<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Search Reviews</h1>

    <!-- Search Form -->
    <Card class="mb-8">
      <template #content>
        <form @submit.prevent="handleSearch" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="field">
              <label for="query" class="block text-sm font-medium text-gray-700">Search</label>
              <InputText
                id="query"
                v-model="searchForm.query"
                class="w-full"
                placeholder="Search reviews..."
              />
            </div>

            <div class="field">
              <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
              <div class="flex items-center gap-2">
                <Dropdown
                  id="category"
                  v-model="searchForm.category"
                  :options="categories"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="All Categories"
                  class="flex-1"
                />
                <Button
                  v-if="searchForm.category"
                  type="button"
                  icon="pi pi-times"
                  severity="primary"
                  @click="clearCategory"
                  :pt="{
                    root: { class: 'px-3' }
                  }"
                  title="Clear category"
                />
              </div>
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
    <div v-if="searchResults.length > 0">
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

    <!-- No Results -->
    <Card v-else-if="hasSearched" class="text-center py-12">
      <template #content>
        <div class="text-gray-500">
          <i class="pi pi-search text-4xl mb-4"></i>
          <p class="text-lg">No reviews found matching your criteria.</p>
          <p class="mt-2">Try adjusting your search filters.</p>
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

const client = useSupabaseClient()
const route = useRoute()
const router = useRouter()

const searchForm = ref({
  query: '',
  category: null,
  rating: null,
  sort: 'created_at',
  order: 'desc'
})

const searchResults = ref([])
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
const { data: categories } = await useAsyncData('categories', async () => {
  const { data } = await client
    .from('categories')
    .select('*')
    .order('name')
  
  return data
})

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

// Fetch search results
const fetchResults = async () => {
  isSearching.value = true
  hasSearched.value = true

  try {
    let query = client
      .from('reviews')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url),
        categories (name, slug)
      `, { count: 'exact' })

    // Apply filters
    if (searchForm.value.query) {
      query = query.or(`title.ilike.%${searchForm.value.query}%,content.ilike.%${searchForm.value.query}%`)
    }

    query = query.eq('is_published', true)

    if (searchForm.value.category) {
      query = query.eq('category_id', searchForm.value.category)
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

    searchResults.value = data || []
    totalResults.value = count || 0
  } catch (error) {
    console.error('Error fetching search results:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred. Please try again.',
      life: 3000
    })
  } finally {
    isSearching.value = false
  }
}

// Initialize search from URL parameters
onMounted(() => {
  const { query, category, rating, sort } = route.query
  
  if (query) searchForm.value.query = query
  if (category) searchForm.value.category = parseInt(category)
  if (rating) searchForm.value.rating = parseInt(rating)
  if (sort) searchForm.value.sort = sort

  if (Object.keys(route.query).length > 0) {
    fetchResults()
  }
})

// Update URL when search parameters change
watch(searchForm, (newValue) => {
  const query = { ...newValue }
  if (!query.category) delete query.category
  if (!query.rating) delete query.rating
  if (!query.query) delete query.query
  if (query.sort === 'created_at') delete query.sort

  router.push({ query })
}, { deep: true })

// Clear category
const clearCategory = () => {
  searchForm.value.category = null
}
</script> 