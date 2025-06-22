<template>
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Users</h1>

    <Card>
      <template #content>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        v-if="user.avatar_url"
                        :src="user.avatar_url"
                        class="h-10 w-10 rounded-full object-cover"
                      />
                      <div
                        v-else
                        class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                      >
                        <i class="pi pi-user text-gray-400"></i>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.full_name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Tag
                    :value="user.is_admin ? 'Admin' : 'User'"
                    :severity="user.is_admin ? 'danger' : 'info'"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Tag
                    :value="user.is_premium ? 'Premium' : 'Free'"
                    :severity="user.is_premium ? 'success' : 'warning'"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(user.created_at) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="handleToggleAdmin(user)"
                    class="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    {{ user.is_admin ? 'Remove Admin' : 'Make Admin' }}
                  </button>
                  <button
                    @click="handleDelete(user.id)"
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
    <ConfirmDialog class="w-4/5" />
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { useConfirm } from 'primevue/useconfirm'

const client = useSupabaseClient()
const toast = useToast()
const confirm = useConfirm()

// Fetch users
const { data: users } = await useAsyncData('admin-users', async () => {
  const { data } = await client
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  return data
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const handleToggleAdmin = async (user) => {
  try {
    const { error } = await client
      .from('profiles')
      .update({ is_admin: !user.is_admin })
      .eq('id', user.id)

    if (error) throw error

    // Update user in the list
    const userIndex = users.value.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users.value[userIndex].is_admin = !user.is_admin
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `User ${user.is_admin ? 'removed from' : 'made'} admin successfully`,
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
        const { error } = await client
          .from('profiles')
          .delete()
          .eq('id', id)

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