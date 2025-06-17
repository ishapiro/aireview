<template>
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Total Reviews</h3>
        <p class="text-3xl font-bold text-primary-600">{{ stats.totalReviews }}</p>
      </div>
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
        <p class="text-3xl font-bold text-primary-600">{{ stats.totalUsers }}</p>
      </div>
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Premium Users</h3>
        <p class="text-3xl font-bold text-primary-600">{{ stats.premiumUsers }}</p>
      </div>
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Total Comments</h3>
        <p class="text-3xl font-bold text-primary-600">{{ stats.totalComments }}</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div class="space-y-4">
          <NuxtLink to="/admin/reviews/new" class="btn-primary block text-center">
            Create New Review
          </NuxtLink>
          <NuxtLink to="/admin/categories" class="btn-secondary block text-center">
            Manage Categories
          </NuxtLink>
          <NuxtLink to="/admin/users" class="btn-secondary block text-center">
            Manage Users
          </NuxtLink>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start">
            <div class="flex-shrink-0">
              <i :class="getActivityIcon(activity.type)" class="text-gray-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-900">{{ activity.description }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(activity.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Reviews -->
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium text-gray-900">Recent Reviews</h3>
        <NuxtLink to="/admin/reviews" class="text-primary-600 hover:text-primary-700">
          View All
        </NuxtLink>
      </div>
      
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
                Rating
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
            <tr v-for="review in recentReviews" :key="review.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ review.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ review.author.full_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="star-rating">
                  <i class="pi pi-star-fill mr-1"></i>
                  {{ review.rating }}
                </div>
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
                  @click="handleDeleteReview(review.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const client = useSupabaseClient()

// Fetch dashboard statistics
const { data: stats } = await useAsyncData('admin-stats', async () => {
  const [
    { count: totalReviews },
    { count: totalUsers },
    { count: premiumUsers },
    { count: totalComments }
  ] = await Promise.all([
    client.from('reviews').select('*', { count: 'exact', head: true }),
    client.from('profiles').select('*', { count: 'exact', head: true }),
    client.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
    client.from('comments').select('*', { count: 'exact', head: true })
  ])

  return {
    totalReviews,
    totalUsers,
    premiumUsers,
    totalComments
  }
})

// Fetch recent activity
const { data: recentActivity } = await useAsyncData('recent-activity', async () => {
  const { data } = await client
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  
  return data
})

// Fetch recent reviews
const { data: recentReviews } = await useAsyncData('recent-reviews', async () => {
  const { data } = await client
    .from('reviews')
    .select(`
      *,
      author:profiles(*)
    `)
    .order('created_at', { ascending: false })
    .limit(5)
  
  return data
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const getActivityIcon = (type) => {
  const icons = {
    review_created: 'pi pi-file',
    review_updated: 'pi pi-pencil',
    user_registered: 'pi pi-user',
    comment_added: 'pi pi-comment'
  }
  return icons[type] || 'pi pi-info-circle'
}

const handleDeleteReview = async (reviewId) => {
  if (!confirm('Are you sure you want to delete this review?')) return

  try {
    await client
      .from('reviews')
      .delete()
      .eq('id', reviewId)
    
    // Refresh the page to update the list
    window.location.reload()
  } catch (error) {
    console.error('Error deleting review:', error)
  }
}
</script> 