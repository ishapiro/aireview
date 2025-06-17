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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="review in reviews" :key="review.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ review.title }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ review.author.full_name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ review.category?.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="star-rating">
                    <i class="pi pi-star-fill mr-1"></i>
                    {{ review.rating }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Tag
                    :value="review.is_published ? 'Published' : 'Draft'"
                    :severity="review.is_published ? 'success' : 'warning'"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <NuxtLink
                    :to="`/admin/reviews/${review.id}/edit`"
                    class="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    Edit
                  </NuxtLink>
                  <button
                    @click="handleDelete(review.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Card>

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { useConfirm } from 'primevue/useconfirm'

const client = useSupabaseClient()
const toast = useToast()
const confirm = useConfirm()

// Fetch reviews with author and category information
const { data: reviews } = await useAsyncData('admin-reviews', async () => {
  const { data } = await client
    .from('reviews')
    .select(`
      *,
      author:profiles(*),
      category:categories(*)
    `)
    .order('created_at', { ascending: false })
  
  return data
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const handleDelete = (id) => {
  confirm.require({
    message: 'Are you sure you want to delete this review?',
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        const { error } = await client
          .from('reviews')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Remove the review from the list
        reviews.value = reviews.value.filter(review => review.id !== id)

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