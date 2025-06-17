<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Profile Information -->
      <div class="md:col-span-2 space-y-6">
        <Card>
          <template #title>Profile Information</template>
          <template #content>
            <form @submit.prevent="handleUpdateProfile" class="space-y-4">
              <div class="field">
                <label for="full-name" class="block text-sm font-medium text-gray-700">Full name</label>
                <InputText
                  id="full-name"
                  v-model="form.fullName"
                  class="w-full"
                  required
                />
              </div>

              <div class="field">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <InputText
                  id="email"
                  v-model="form.email"
                  class="w-full"
                  disabled
                />
                <small class="text-gray-500">Email cannot be changed</small>
              </div>

              <div class="field">
                <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
                <Textarea
                  id="bio"
                  v-model="form.bio"
                  rows="4"
                  class="w-full"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div class="field">
                <label class="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <div class="flex items-center">
                  <img
                    v-if="form.avatar_url"
                    :src="form.avatar_url"
                    class="h-16 w-16 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <i class="pi pi-user text-2xl text-gray-400"></i>
                  </div>
                  <Button
                    type="button"
                    @click="handleAvatarUpload"
                    class="ml-4"
                    severity="secondary"
                    label="Change Avatar"
                  />
                </div>
              </div>

              <div class="flex justify-end">
                <Button
                  type="submit"
                  :loading="isUpdating"
                  label="Save Changes"
                />
              </div>
            </form>
          </template>
        </Card>

        <!-- Change Password -->
        <Card>
          <template #title>Change Password</template>
          <template #content>
            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div class="field">
                <label for="current-password" class="block text-sm font-medium text-gray-700">Current password</label>
                <div class="relative w-full">
                  <Password
                    id="current-password"
                    v-model="passwordForm.currentPassword"
                    :feedback="false"
                    toggleMask
                    required
                    class="w-full"
                    inputClass="w-full pr-8"
                    :inputStyle="{ width: '100%' }"
                    autocomplete="current-password"
                  >
                    <template #hideicon>
                      <i class="pi pi-eye-slash absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700" style="font-size: 1rem; z-index: 1;" />
                    </template>
                    <template #showicon>
                      <i class="pi pi-eye absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700" style="font-size: 1rem; z-index: 1;" />
                    </template>
                  </Password>
                </div>
              </div>

              <div class="field">
                <label for="new-password" class="block text-sm font-medium text-gray-700">New password</label>
                <div class="relative w-full">
                  <Password
                    id="new-password"
                    v-model="passwordForm.newPassword"
                    toggleMask
                    required
                    class="w-full"
                    inputClass="w-full pr-8"
                    :inputStyle="{ width: '100%' }"
                    autocomplete="new-password"
                  >
                    <template #hideicon>
                      <i class="pi pi-eye-slash absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700" style="font-size: 1rem; z-index: 1;" />
                    </template>
                    <template #showicon>
                      <i class="pi pi-eye absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700" style="font-size: 1rem; z-index: 1;" />
                    </template>
                  </Password>
                </div>
              </div>

              <div class="field">
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm new password</label>
                <div class="relative w-full">
                  <Password
                    id="confirm-password"
                    v-model="passwordForm.confirmPassword"
                    :feedback="false"
                    toggleMask
                    required
                    class="w-full"
                    inputClass="w-full pr-8"
                    :inputStyle="{ width: '100%' }"
                    autocomplete="new-password"
                  >
                    <template #hideicon>
                      <i class="pi pi-eye-slash absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700" style="font-size: 1rem; z-index: 1;" />
                    </template>
                    <template #showicon>
                      <i class="pi pi-eye absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700" style="font-size: 1rem; z-index: 1;" />
                    </template>
                  </Password>
                </div>
              </div>

              <div class="flex justify-end">
                <Button
                  type="submit"
                  :loading="isChangingPassword"
                  label="Change Password"
                />
              </div>
            </form>
          </template>
        </Card>
      </div>

      <!-- Subscription -->
      <div class="space-y-6">
        <Card>
          <template #title>Subscription</template>
          <template #content>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Status</span>
                <Tag
                  :value="profile.is_premium ? 'Premium' : 'Free'"
                  :severity="profile.is_premium ? 'success' : 'info'"
                />
              </div>

              <div v-if="!profile.is_premium">
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
                  severity="secondary"
                  label="Manage Subscription"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Account Actions -->
        <Card>
          <template #title>Account Actions</template>
          <template #content>
            <div class="space-y-4">
              <NuxtLink
                v-if="profile.is_admin"
                to="/admin"
                class="block w-full"
              >
                <Button
                  class="w-full"
                  severity="secondary"
                  label="Admin Dashboard"
                  icon="pi pi-cog"
                />
              </NuxtLink>
              <Button
                @click="handleDeleteAccount"
                class="w-full"
                severity="danger"
                label="Delete Account"
              />
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
const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

// Redirect if not logged in
if (!user.value) {
  navigateTo('/auth/login')
}

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

const isUpdating = ref(false)
const isChangingPassword = ref(false)
const error = ref('')

// Fetch profile data
const { data: profile } = await useAsyncData('profile', async () => {
  const { data } = await client
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)
    .single()
  
  return data
})

// Update form with profile data
watchEffect(() => {
  if (profile.value) {
    form.value = {
      fullName: profile.value.full_name,
      email: profile.value.email,
      bio: profile.value.bio || '',
      avatar_url: profile.value.avatar_url
    }
  }
})

const handleUpdateProfile = async () => {
  isUpdating.value = true
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
  } catch (err) {
    error.value = err.message
    toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 })
  } finally {
    isUpdating.value = false
  }
}

const handleChangePassword = async () => {
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