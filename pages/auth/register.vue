<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full">
      <Card>
        <template #content>
          <div class="space-y-6">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-gray-900">Create your account</h1>
              <p class="mt-2 text-sm text-gray-600">
                Or
                <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-500">
                  sign in to your account
                </NuxtLink>
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- First Name -->
              <div>
                <label for="first-name" class="block text-sm text-gray-600 mb-1">First Name</label>
                <InputText
                  id="first-name"
                  v-model="form.firstName"
                  placeholder="Your First Name"
                  :class="{ 'p-invalid': submitted && !form.firstName }"
                  class="w-full"
                />
                <small class="text-red-500" v-if="submitted && !form.firstName">First name is required</small>
              </div>

              <!-- Last Name -->
              <div>
                <label for="last-name" class="block text-sm text-gray-600 mb-1">Last Name</label>
                <InputText
                  id="last-name"
                  v-model="form.lastName"
                  placeholder="Your Last Name"
                  :class="{ 'p-invalid': submitted && !form.lastName }"
                  class="w-full"
                />
                <small class="text-red-500" v-if="submitted && !form.lastName">Last name is required</small>
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm text-gray-600 mb-1">Email</label>
                <InputText
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="Your Email"
                  :class="{ 'p-invalid': submitted && !form.email }"
                  class="w-full"
                />
                <small class="text-red-500" v-if="submitted && !form.email">Email is required</small>
                <small class="text-red-500" v-else-if="submitted && !isValidEmail(form.email)">Please enter a valid email</small>
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm text-gray-600 mb-1">Phone (Optional)</label>
                <InputText
                  id="phone"
                  v-model="form.phone"
                  placeholder="Your Phone Number"
                  class="w-full"
                />
              </div>

              <!-- Website -->
              <div>
                <label for="website" class="block text-sm text-gray-600 mb-1">Website (Optional)</label>
                <InputText
                  id="website"
                  v-model="form.website"
                  placeholder="Your Website"
                  class="w-full"
                />
              </div>

              <!-- Avatar Upload -->
              <div>
                <label class="block text-sm text-gray-600 mb-3">Profile Picture (Optional)</label>
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <img 
                      :src="form.avatar_url || '/default-avatar.svg'" 
                      :alt="form.firstName"
                      class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
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
                      class="p-button-outlined p-button-sm"
                    />
                    <Button
                      v-if="form.avatar_url"
                      type="button"
                      label="Remove"
                      icon="pi pi-trash"
                      @click="handleRemoveAvatar"
                      class="p-button-outlined p-button-danger p-button-sm"
                    />
                  </div>
                </div>
                <small class="text-gray-500">Upload a profile picture (JPG, PNG, GIF up to 5MB)</small>
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="block text-sm text-gray-600 mb-1">Password</label>
                <Password
                  id="password"
                  v-model="form.password"
                  placeholder="Your Password"
                  :feedback="true"
                  toggleMask
                  :class="{ 'p-invalid': submitted && !form.password }"
                  class="w-full"
                  :inputProps="{ autocomplete: 'new-password' }"
                />
                <small class="text-red-500" v-if="submitted && !form.password">Password is required</small>
                <small class="text-red-500" v-else-if="submitted && form.password.length < 6">Password must be at least 6 characters</small>
              </div>

              <!-- Confirm Password -->
              <div>
                <label for="confirm-password" class="block text-sm text-gray-600 mb-1">Confirm Password</label>
                <Password
                  id="confirm-password"
                  v-model="form.confirmPassword"
                  placeholder="Confirm Password"
                  :feedback="false"
                  toggleMask
                  :class="{ 'p-invalid': submitted && !form.confirmPassword }"
                  class="w-full"
                  :inputProps="{ autocomplete: 'new-password' }"
                />
                <small class="text-red-500" v-if="submitted && !form.confirmPassword">Please confirm your password</small>
              </div>

              <!-- Terms -->
              <div class="flex items-start space-x-2">
                <Checkbox v-model="form.terms" :binary="true" inputId="terms" />
                <label for="terms" class="text-sm text-gray-600">
                  I agree to the <NuxtLink to="/terms" class="text-primary hover:text-primary-600">Terms of Service</NuxtLink> and
                  <NuxtLink to="/privacy" class="text-primary hover:text-primary-600">Privacy Policy</NuxtLink>
                </label>
              </div>

              <!-- Submit -->
              <Button
                type="submit"
                label="Create Account"
                class="w-full bg-primary hover:bg-primary-600 text-white"
                :loading="isLoading"
              />

              <!-- Google Sign Up -->
              <Button
                label="Sign up with Google"
                icon="pi pi-google"
                class="w-full p-button-outlined p-button-secondary mt-2"
                @click="handleGoogleSignUp"
                type="button"
              />

              <!-- Links -->
              <div class="text-center text-sm">
                <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-500">
                  Already have an account? Sign in
                </NuxtLink>
              </div>
            </form>
          </div>
        </template>
      </Card>

      <!-- Toast for notifications -->
      <Toast position="top-center" />
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const config = useRuntimeConfig()

// Redirect if already logged in
if (user.value) {
  navigateTo('/')
}

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  website: '',
  password: '',
  confirmPassword: '',
  terms: false,
  avatar_url: ''
})

const submitted = ref(false)
const isLoading = ref(false)
const isUploading = ref(false)

const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailPattern.test(email)
}

const handleSubmit = async () => {
  submitted.value = true

  if (!form.value.firstName || 
      !form.value.lastName ||
      !form.value.email || 
      !form.value.password || 
      !form.value.confirmPassword || 
      !form.value.terms ||
      !isValidEmail(form.value.email) ||
      form.value.password.length < 6 ||
      form.value.password !== form.value.confirmPassword) {
    return
  }

  isLoading.value = true

  try {
    const { error: signUpError, data } = await client.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          first_name: form.value.firstName,
          last_name: form.value.lastName,
          phone: form.value.phone,
          website: form.value.website
        }
      }
    })

    if (signUpError) throw signUpError

    // Create user profile
    const { error: profileError } = await client
      .from('profiles')
      .insert({
        id: data.user.id,
        first_name: form.value.firstName,
        last_name: form.value.lastName,
        email: form.value.email,
        phone: form.value.phone,
        website: form.value.website,
        avatar_url: form.value.avatar_url
      })

    if (profileError) throw profileError

    navigateTo('/auth/verify-email')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const handleGoogleSignUp = async () => {
  try {
    const redirectTo = `${config.public.siteUrl}/`
    const options = { provider: 'google', options: { redirectTo } }
    console.log('[GoogleSignUp] config.public.siteUrl:', config.public.siteUrl)
    console.log('[GoogleSignUp] redirectTo:', redirectTo)
    console.log('[GoogleSignUp] options:', options)
    const { data, error } = await client.auth.signInWithOAuth(options)
    console.log('[GoogleSignUp] Supabase response:', { data, error })
    if (error) throw error
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  }
}

const handleAvatarUpload = async () => {
  isUploading.value = true
  try {
    const file = await new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => resolve(e.target.files[0])
      input.click()
    })

    if (!file) {
      isUploading.value = false
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'File size must be less than 5MB', life: 3000 })
      isUploading.value = false
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a valid image file', life: 3000 })
      isUploading.value = false
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `temp-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await client.storage
      .from('reviews')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = client.storage
      .from('reviews')
      .getPublicUrl(filePath)

    form.value.avatar_url = publicUrl
    toast.add({ severity: 'success', summary: 'Success', detail: 'Avatar uploaded successfully!', life: 3000 })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error uploading avatar. Please try again.', life: 3000 })
  } finally {
    isUploading.value = false
  }
}

const handleRemoveAvatar = () => {
  form.value.avatar_url = ''
  toast.add({ severity: 'success', summary: 'Success', detail: 'Avatar removed successfully!', life: 3000 })
}
</script> 