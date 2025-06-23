<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

    <Card>
      <template #content>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status / Role
                </th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th scope="col" class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI
                </th>
                <th scope="col" class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DB
                </th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id">
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img 
                        v-if="user.avatar_url && !user.avatar_error" 
                        :src="user.avatar_url" 
                        class="h-10 w-10 rounded-full object-cover" 
                        :alt="user.full_name" 
                        @error="user.avatar_error = true"
                      />
                      <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <i class="pi pi-user text-gray-400"></i>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.full_name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex flex-col space-y-1">
                    <Tag :value="user.is_premium ? 'Premium' : 'Free'" :severity="user.is_premium ? 'success' : 'secondary'" />
                    <Tag :value="user.is_admin ? 'Admin' : 'User'" :severity="user.is_admin ? 'danger' : 'info'" />
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ user.review_views }}</td>
                <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ user.ai_searches }}</td>
                <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ user.db_searches }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex items-center justify-center space-x-3">
                    <button v-if="!user.is_admin" @click="handleToggleAdmin(user)" v-tooltip.top="'Make Admin'" class="text-green-600 hover:text-green-900">
                      <i class="pi pi-user-plus"></i>
                    </button>
                    <button v-else @click="handleToggleAdmin(user)" v-tooltip.top="'Remove Admin'" class="text-yellow-600 hover:text-yellow-900">
                      <i class="pi pi-user-minus"></i>
                    </button>
                    <button @click="handleDelete(user.id)" v-tooltip.top="'Delete User'" class="text-red-600 hover:text-red-900">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Card>

    <Toast />
    <ConfirmDialog class="w-4/5" />
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: ['auth-admin']
})

const client = useSupabaseClient()
const toast = useToast()
const confirm = useConfirm()

// Fetch users
const { data: users } = await useAsyncData('admin-users-with-counts', async () => {
  const { data, error } = await client.rpc('get_users_with_activity_counts')
  
  if (error) {
    console.error('Error fetching users with activity counts:', error)
    toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not load user activity data.',
        life: 3000,
    })
    return []
  }
  return data
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return format(new Date(date), 'MMM d, yyyy')
}

const handleToggleAdmin = async (user) => {
  try {
    const newAdminStatus = !user.is_admin
    const { error } = await client
      .from('profiles')
      .update({ is_admin: newAdminStatus })
      .eq('id', user.id)

    if (error) throw error

    // Update user in the list
    const userIndex = users.value.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users.value[userIndex].is_admin = newAdminStatus
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `User ${newAdminStatus ? 'made' : 'removed from'} admin successfully`,
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

const handleDelete = (id) => {
  confirm.require({
    message: 'Are you sure you want to delete this user? This action cannot be undone.',
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-info',
    accept: async () => {
      try {
        // This should cascade and delete the user from auth.users as well
        const { error } = await client.rpc('delete_user', { user_id_to_delete: id })

        if (error) throw error

        // Remove user from the list
        users.value = users.value.filter(user => user.id !== id)

        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully',
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