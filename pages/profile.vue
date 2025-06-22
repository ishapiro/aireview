<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Profile Form -->
      <div class="md:col-span-2">
        <Card>
          <template #content>
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">Profile Information</h2>
              
              <!-- Avatar Section -->
              <div class="field">
                <label class="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <img 
                      :src="form.avatar_url || '/default-avatar.svg'" 
                      :alt="form.fullName"
                      class="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      @error="$event.target.src = '/default-avatar.svg'"
                    />
                    <div v-if="isUploading" class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <i class="pi pi-spin pi-spinner text-white"></i>
                    </div>
                  </div>
                  <div class="flex flex-col space-y-2">
                    <Button
                      type="button"
                      label="Upload Image"
                      icon="pi pi-upload"
                      @click="handleAvatarUpload"
                      :loading="isUploading"
                      class="p-button-outlined"
                    />
                    <Button
                      v-if="form.avatar_url"
                      type="button"
                      label="Remove"
                      icon="pi pi-trash"
                      @click="handleRemoveAvatar"
                      class="p-button-outlined p-button-danger"
                    />
                  </div>
                </div>
                <small class="text-gray-500">Upload a profile picture (JPG, PNG, GIF up to 5MB)</small>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="field">
                  <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
                  <InputText
                    id="fullName"
                    v-model="form.fullName"
                    class="w-full"
                  />
                </div>

                <div class="field">
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <InputText
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="w-full"
                    disabled
                  />
                </div>

                <div class="field">
                  <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
                  <Textarea
                    id="bio"
                    v-model="form.bio"
                    rows="4"
                    class="w-full"
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    :loading="isSubmitting"
                    class="w-full"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </template>
        </Card>

        <!-- Password Change -->
        <Card class="mt-6">
          <template #content>
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">Change Password</h2>
              <form @submit.prevent="handlePasswordChange" class="space-y-6">
                <!-- Hidden username field for password managers -->
                <input
                  type="email"
                  :value="form.email"
                  autocomplete="username"
                  style="display: none"
                />

                <div class="field">
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
                  <Password
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    :feedback="false"
                    toggleMask
                    :inputProps="{ autocomplete: 'current-password' }"
                    class="w-full"
                  />
                </div>

                <div class="field">
                  <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                  <Password
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    :feedback="false"
                    toggleMask
                    :inputProps="{ autocomplete: 'new-password' }"
                    class="w-full"
                  />
                </div>

                <div class="field">
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <Password
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    :feedback="false"
                    toggleMask
                    :inputProps="{ autocomplete: 'new-password' }"
                    class="w-full"
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    :loading="isChangingPassword"
                    class="w-full"
                  >
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          </template>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <Card>
          <template #content>
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900">Subscription</h2>
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Status</span>
                <Tag
                  :value="profile?.is_premium ? 'Premium' : 'Free'"
                  :severity="profile?.is_premium ? 'success' : 'info'"
                />
              </div>

              <div v-if="!profile?.is_premium">
                <Button
                  @click="handleUpgrade"
                  class="w-full"
                  label="Upgrade to Premium"
                />
              </div>
              <div v-else>
                <Button
                  @click="handleManageSubscription"
                  class="w-full"
                  label="Manage Subscription"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Account Actions -->
        <Card>
          <template #content>
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900">Account Actions</h2>
              <div class="space-y-4">
                <NuxtLink
                  v-if="profile?.is_admin"
                  to="/admin"
                  class="block w-full"
                >
                  <Button
                    class="w-full"
                    label="Admin Dashboard"
                    icon="pi pi-cog"
                  />
                </NuxtLink>
                <Button
                  @click="handleDeleteAccount"
                  class="w-full bg-red-600 text-white"
                  label="Delete Account"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- My Generated Review Lists -->
    <Card class="mt-8">
      <template #content>
        <h3 class="text-lg font-medium text-gray-900 mb-4">My Generated Review Lists</h3>
        <div v-if="generatedLists.length > 0" class="space-y-6">
          <div v-for="list in generatedLists" :key="list.id" class="border p-4 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <div>
                <p class="font-medium">{{ list.businessType }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(list.date) }}</p>
              </div>
            </div>
            <ul class="space-y-2">
              <li v-for="review in list.reviews" :key="review.id">
                <NuxtLink :to="`/reviews/${review.slug}`" class="text-primary-600 hover:underline">
                  <div class="text-sm font-medium text-gray-900">{{ cleanTitle(review.title) }}</div>
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div class="mt-4">
            <Button label="Clear Saved Lists" @click="clearLocalStorage" severity="danger" outlined />
          </div>
        </div>
        <div v-else>
          <p class="text-gray-500">You have not generated any review lists yet. Go to the homepage to get started.</p>
        </div>
      </template>
    </Card>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useImageUpload } from '@/composables/useImageUpload'
import { format } from 'date-fns'
import { cleanTitle } from '~/utils/string'

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const confirm = useConfirm()
const { uploadAvatar } = useImageUpload()
const profile = ref({})
const error = ref('')
const isSubmitting = ref(false)
const isChangingPassword = ref(false)
const isUploading = ref(false)
const generatedLists = ref([])

const form = ref({
  fullName: '',
  email: '',
  bio: '',
  avatar_url: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Redirect if not logged in
if (!user.value) {
  navigateTo('/auth/login')
}

// Fetch user profile
const fetchProfile = async () => {
  try {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.value?.id)
      .single()

    if (error) throw error
    profile.value = data
    form.value = {
      fullName: data.full_name,
      email: data.email,
      bio: data.bio || '',
      avatar_url: data.avatar_url
    }
    console.log('Fetched profile:', JSON.parse(JSON.stringify(data)))
    console.log('Assigned to form.value:', JSON.parse(JSON.stringify(form.value)))

    // Load generated lists from local storage
    loadFromLocalStorage()
  } catch (err) {
    console.error('Error fetching profile:', err)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load profile',
      life: 3000
    })
  }
}

// Call fetchProfile when component mounts
onMounted(() => {
  if (user.value) {
    fetchProfile()
  }
})

// Watch for user changes
watch(user, (newUser) => {
  if (newUser) {
    fetchProfile()
  } else {
    profile.value = {}
    form.value = {
      fullName: '',
      email: '',
      bio: '',
      avatar_url: ''
    }
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  error.value = ''

  try {
    const { error: updateError } = await client
      .from('profiles')
      .update({
        full_name: form.value.fullName,
        bio: form.value.bio,
        avatar_url: form.value.avatar_url
      })
      .eq('id', user.value.id)

    if (updateError) throw updateError

    toast.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully!', life: 3000 })
    // Refetch and log
    await fetchProfile()
    console.log('Profile updated and refetched')
  } catch (err) {
    error.value = err.message
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally {
    isSubmitting.value = false
  }
}

const handlePasswordChange = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'New passwords do not match', life: 3000 })
    return
  }

  isChangingPassword.value = true
  error.value = ''

  try {
    const { error: updateError } = await client.auth.updateUser({
      password: passwordForm.value.newPassword
    })

    if (updateError) throw updateError

    toast.add({ severity: 'success', summary: 'Success', detail: 'Password changed successfully!', life: 3000 })
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (err) {
    error.value = err.message
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally {
    isChangingPassword.value = false
  }
}

const handleAvatarUpload = async () => {
  isUploading.value = true
  try {
    const publicUrl = await uploadAvatar(user.value.id)
    if (publicUrl) {
      form.value.avatar_url = publicUrl
    }
  } catch (error) {
    // Error handling is already done in the composable
    console.error('Error in handleAvatarUpload:', error)
  } finally {
    isUploading.value = false
  }
}

const handleRemoveAvatar = () => {
  form.value.avatar_url = null
  toast.add({ severity: 'success', summary: 'Success', detail: 'Avatar removed successfully!', life: 3000 })
}

const handleUpgrade = () => {
  // Implement subscription upgrade logic
  toast.add({ severity: 'info', summary: 'Coming Soon', detail: 'Subscription upgrade functionality to be implemented', life: 3000 })
}

const handleManageSubscription = () => {
  // Implement subscription management logic
  toast.add({ severity: 'info', summary: 'Coming Soon', detail: 'Subscription management functionality to be implemented', life: 3000 })
}

const handleDeleteAccount = async () => {
  const confirmed = await new Promise((resolve) => {
    confirm.require({
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      header: 'Delete Account',
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      accept: () => resolve(true),
      reject: () => resolve(false)
    })
  })

  if (!confirmed) return

  try {
    const { error: deleteError } = await client.auth.admin.deleteUser(user.value.id)
    if (deleteError) throw deleteError

    await client.auth.signOut()
    navigateTo('/')
  } catch (err) {
    error.value = err.message
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  }
}

const loadFromLocalStorage = () => {
  const storageKey = `user-generated-reviews-${user.value.id}`
  const storedData = localStorage.getItem(storageKey)
  if (storedData) {
    generatedLists.value = JSON.parse(storedData)
  }
}

const clearLocalStorage = async () => {
  const confirmed = await new Promise((resolve) => {
    confirm.require({
      message: 'Are you sure you want to delete all of your saved review lists? This cannot be undone.',
      header: 'Clear Lists',
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      accept: () => resolve(true),
      reject: () => resolve(false)
    })
  })

  if (confirmed) {
    const storageKey = `user-generated-reviews-${user.value.id}`
    localStorage.removeItem(storageKey)
    generatedLists.value = []
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'All saved review lists have been cleared',
      life: 3000
    })
  }
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMMM d, yyyy @ h:mm a')
}
</script> 