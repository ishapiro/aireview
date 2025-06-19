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

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const confirm = useConfirm()
const profile = ref({})
const error = ref('')
const isSubmitting = ref(false)
const isChangingPassword = ref(false)

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
  try {
    const file = await new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => resolve(e.target.files[0])
      input.click()
    })

    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.value.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await client.storage
      .from('profiles')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = client.storage
      .from('profiles')
      .getPublicUrl(filePath)

    form.value.avatar_url = publicUrl
    toast.add({ severity: 'success', summary: 'Success', detail: 'Avatar uploaded successfully!', life: 3000 })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error uploading avatar. Please try again.', life: 3000 })
  }
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
    const dialog = useConfirm({
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
</script> 