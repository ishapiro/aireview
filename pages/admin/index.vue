<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-600 mt-2 text-sm sm:text-base">Manage your site content and monitor activity</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-50 rounded-lg">
            <i class="pi pi-file text-blue-600 text-lg sm:text-xl"></i>
          </div>
          <div class="ml-3 sm:ml-4">
            <p class="text-xs sm:text-sm font-medium text-gray-600">Total Reviews</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ stats.totalReviews }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-50 rounded-lg">
            <i class="pi pi-users text-green-600 text-lg sm:text-xl"></i>
          </div>
          <div class="ml-3 sm:ml-4">
            <p class="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-50 rounded-lg">
            <i class="pi pi-star text-yellow-600 text-lg sm:text-xl"></i>
          </div>
          <div class="ml-3 sm:ml-4">
            <p class="text-xs sm:text-sm font-medium text-gray-600">Premium Users</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ stats.premiumUsers }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-50 rounded-lg">
            <i class="pi pi-comments text-purple-600 text-lg sm:text-xl"></i>
          </div>
          <div class="ml-3 sm:ml-4">
            <p class="text-xs sm:text-sm font-medium text-gray-600">Total Comments</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ stats.totalComments }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-6 sm:mb-8">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <NuxtLink 
          to="/admin/reviews/new" 
          class="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 no-underline"
        >
          <div class="flex items-center mb-3 sm:mb-4">
            <div class="p-2 sm:p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <i class="pi pi-plus text-blue-600 text-lg sm:text-xl"></i>
            </div>
            <h3 class="ml-3 sm:ml-4 text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Create Review</h3>
          </div>
          <p class="text-gray-600 text-xs sm:text-sm">Add a new product review to the database</p>
        </NuxtLink>

        <NuxtLink 
          to="/admin/categories" 
          class="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md hover:border-green-200 transition-all duration-200 no-underline"
        >
          <div class="flex items-center mb-3 sm:mb-4">
            <div class="p-2 sm:p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <i class="pi pi-tags text-green-600 text-lg sm:text-xl"></i>
            </div>
            <h3 class="ml-3 sm:ml-4 text-base sm:text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Manage Tags</h3>
          </div>
          <p class="text-gray-600 text-xs sm:text-sm">Organize and manage product tags</p>
        </NuxtLink>

        <NuxtLink 
          to="/admin/users" 
          class="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md hover:border-purple-200 transition-all duration-200 no-underline"
        >
          <div class="flex items-center mb-3 sm:mb-4">
            <div class="p-2 sm:p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
              <i class="pi pi-users text-purple-600 text-lg sm:text-xl"></i>
            </div>
            <h3 class="ml-3 sm:ml-4 text-base sm:text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Manage Users</h3>
          </div>
          <p class="text-gray-600 text-xs sm:text-sm">View and manage user accounts</p>
        </NuxtLink>

        <NuxtLink 
          to="/admin/reviews/dedup" 
          class="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md hover:border-orange-200 transition-all duration-200 no-underline"
        >
          <div class="flex items-center mb-3 sm:mb-4">
            <div class="p-2 sm:p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
              <i class="pi pi-filter text-orange-600 text-lg sm:text-xl"></i>
            </div>
            <h3 class="ml-3 sm:ml-4 text-base sm:text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Deduplicate Reviews</h3>
          </div>
          <p class="text-gray-600 text-xs sm:text-sm">Find and remove duplicate reviews</p>
        </NuxtLink>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div class="flex items-center mb-3 sm:mb-4">
            <div class="p-2 sm:p-3 bg-indigo-50 rounded-lg">
              <i class="pi pi-database text-indigo-600 text-lg sm:text-xl"></i>
            </div>
            <h3 class="ml-3 sm:ml-4 text-base sm:text-lg font-semibold text-gray-900">Tag Tools</h3>
          </div>
          <div class="space-y-2 sm:space-y-3">
            <CategoryPopulator />
            <UncategorizedReviewCategorizer />
            <AppendCategoryToReviews />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div class="flex items-center mb-3 sm:mb-4">
            <div class="p-2 sm:p-3 bg-gray-50 rounded-lg">
              <i class="pi pi-chart-line text-gray-600 text-lg sm:text-xl"></i>
            </div>
            <h3 class="ml-3 sm:ml-4 text-base sm:text-lg font-semibold text-gray-900">Analytics</h3>
          </div>
          <p class="text-gray-600 text-xs sm:text-sm">View detailed analytics and reports</p>
          <div class="mt-3 sm:mt-4">
            <button class="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Reviews -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
          <i class="pi pi-clock text-gray-400"></i>
        </div>
        <div class="space-y-3 sm:space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
              <i :class="getActivityIcon(activity.type)" class="text-gray-600"></i>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-xs sm:text-sm text-gray-900 font-medium" :title="cleanTitle(activity.description)">
                {{ truncate(cleanTitle(activity.description), 60) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(activity.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reviews -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">Recent Reviews</h3>
          <NuxtLink to="/admin/reviews" class="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </NuxtLink>
        </div>
        <div class="space-y-3 sm:space-y-4">
          <div v-for="review in recentReviews" :key="review.id" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{ review.title }}</p>
              <div class="flex flex-col sm:flex-row sm:items-center mt-1 space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
                <span>{{ review.author.full_name }}</span>
                <div class="flex items-center">
                  <i class="pi pi-star-fill text-yellow-400 mr-1"></i>
                  {{ review.rating }}
                </div>
                <span>{{ formatDate(review.created_at) }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4">
              <NuxtLink
                :to="`/admin/reviews/${review.id}`"
                class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
              >
                <i class="pi pi-pencil text-sm"></i>
              </NuxtLink>
              <button
                @click="handleDeleteReview(review.id)"
                class="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <i class="pi pi-trash text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import CategoryPopulator from '~/components/CategoryPopulator.vue'
import UncategorizedReviewCategorizer from '~/components/UncategorizedReviewCategorizer.vue'
import AppendCategoryToReviews from '~/components/AppendCategoryToReviews.vue'
import { cleanTitle } from '~/utils/string'

definePageMeta({
  middleware: ['auth-admin']
})

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

const truncate = (text, length) => {
  if (text.length <= length) {
    return text
  }
  return text.substring(0, length) + '...'
}

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