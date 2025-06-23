<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Reviews</h1>
      <NuxtLink to="/admin/reviews/new">
        <Button label="Create New Review" icon="pi pi-plus" />
      </NuxtLink>
    </div>

    <Card>
      <template #content>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="review in reviews" :key="review.id">
                <td class="px-2 py-4 whitespace-nowrap">
                  <div class="text-sm font-normal text-gray-900" :title="cleanTitle(removeMarkdown(review.title))">
                    {{ truncate(cleanTitle(removeMarkdown(review.title)), 40) }}
                  </div>
                </td>
                <td class="px-2 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ review.author.full_name }}</div>
                </td>
                <td class="px-2 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ review.category?.name }}</div>
                </td>
                <td class="px-2 py-4 whitespace-nowrap">
                  <div class="star-rating">
                    <i class="pi pi-star-fill mr-1"></i>
                    {{ review.rating }}
                  </div>
                </td>
                <td class="px-2 py-4 whitespace-nowrap">
                  <Tag
                    :value="review.is_published ? 'Published' : 'Draft'"
                    :severity="review.is_published ? 'success' : 'warning'"
                  />
                </td>
                <td class="px-2 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</div>
                </td>
                <td class="px-2 py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center justify-center space-x-4">
                    <NuxtLink
                      :to="`/admin/reviews/${review.id}`"
                      class="text-primary-600 hover:text-primary-900"
                      title="Edit review"
                    >
                      <i class="pi pi-pencil text-base"></i>
                    </NuxtLink>
                    <button
                      v-if="!review.is_published"
                      @click="handleDelete(review.id)"
                      class="text-red-600 hover:text-red-900"
                      title="Delete unpublished review"
                    >
                      <i class="pi pi-trash text-base"></i>
                    </button>
                    <span v-else class="text-gray-400" title="Published reviews cannot be deleted">
                      <i class="pi pi-lock text-base"></i>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination Controls -->
        <div class="flex justify-between items-center mt-4">
          <span class="text-sm text-gray-600">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalReviews) }} of {{ totalReviews }} reviews
          </span>
          <div class="flex items-center space-x-2">
            <Button
              @click="previousPage"
              :disabled="currentPage === 1"
              icon="pi pi-chevron-left"
              size="small"
            />
            <span class="text-sm text-gray-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <Button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              icon="pi pi-chevron-right"
              size="small"
            />
          </div>
        </div>
      </template>
    </Card>

    <Toast />
    <ConfirmDialog class="w-4/5" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { format } from 'date-fns'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { cleanTitle } from '~/utils/string'

definePageMeta({
  middleware: ['auth-admin']
})

const client = useSupabaseClient()
const toast = useToast()
const confirm = useConfirm()

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 10
const totalReviews = ref(0)
const reviews = ref([])

const totalPages = computed(() => Math.ceil(totalReviews.value / itemsPerPage))

// Fetch reviews with author and category information
const fetchReviews = async () => {
  const from = (currentPage.value - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  const { data, error, count } = await client
    .from('reviews')
    .select(`
      *,
      author:profiles(*),
      category:categories(*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  
  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch reviews',
      life: 3000
    })
    return
  }

  reviews.value = data
  totalReviews.value = count
}

// Initial fetch
fetchReviews()

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchReviews()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchReviews()
  }
}

const removeMarkdown = (text) => {
  if (!text || typeof text !== 'string') return ''
  return text.replace(/\*/g, '')
}

const truncate = (text, length) => {
  if (text.length <= length) {
    return text
  }
  return text.substring(0, length) + '...'
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const handleDelete = (id) => {
  const review = reviews.value.find(r => r.id === id)
  confirm.require({
    message: `Are you sure you want to delete the unpublished review "${review?.title}"? This action cannot be undone.`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-info',
    accept: async () => {
      try {
        const { error } = await client
          .from('reviews')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Refetch reviews to update the page
        fetchReviews()

        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Review deleted successfully',
          life: 3000
        })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000
        })
      }
    }
  })
}
</script> 