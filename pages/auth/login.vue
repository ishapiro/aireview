<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full">
      <Card>
        <template #content>
          <div class="space-y-6">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-gray-900">Sign in to your account</h1>
              <p class="mt-2 text-sm text-gray-600">
                Or
                <NuxtLink to="/auth/register" class="text-primary-600 hover:text-primary-500">
                  create a new account
                </NuxtLink>
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
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
                  autocomplete="username"
                />
                <small class="text-red-500" v-if="submitted && !form.email">Email is required</small>
                <small class="text-red-500" v-else-if="submitted && !isValidEmail(form.email)">Please enter a valid email</small>
              </div>

              <!-- Password -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label for="password" class="block text-sm text-gray-600">Password</label>
                  <NuxtLink
                    to="/auth/forgot-password"
                    class="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Forgot password?
                  </NuxtLink>
                </div>
                <Password
                  id="password"
                  v-model="form.password"
                  placeholder="Your Password"
                  :feedback="false"
                  toggleMask
                  :class="{ 'p-invalid': submitted && !form.password }"
                  class="w-full"
                  :inputProps="{ autocomplete: 'current-password' }"
                />
                <small class="text-red-500" v-if="submitted && !form.password">Password is required</small>
                <small class="text-red-500" v-else-if="submitted && form.password.length < 6">Password must be at least 6 characters</small>
              </div>

              <!-- Remember me -->
              <div class="flex items-center justify-between">
                <Checkbox v-model="form.remember" :binary="true" inputId="remember-me" />
                <label for="remember-me" class="ml-2 text-sm text-gray-600">Remember me</label>
              </div>

              <!-- Submit -->
              <Button
                type="submit"
                label="Sign In"
                class="w-full p-button-primary"
                :loading="isLoading"
              />

              <!-- Google Sign In -->
              <Button
                label="Sign in with Google"
                icon="pi pi-google"
                class="w-full p-button-primary mt-2"
                @click="handleGoogleSignIn"
                type="button"
              />

              <!-- Links -->
              <div class="text-center text-sm">
                <NuxtLink to="/auth/register" class="text-primary-600 hover:text-primary-500">
                  Don't have an account? Sign up
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

console.log('Login page script loaded');

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const config = useRuntimeConfig()

console.log('User value at script start:', user.value)

// Redirect if already logged in
if (user.value) {
  console.log('Redirecting to home because user is logged in');
  navigateTo('/')
}

const form = ref({
  email: '',
  password: '',
  remember: false
})

const submitted = ref(false)
const isLoading = ref(false)

const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailPattern.test(email)
}

const handleSubmit = async () => {
  console.log('Form submitted', form.value)
  submitted.value = true

  if (!form.value.email || !form.value.password || !isValidEmail(form.value.email) || form.value.password.length < 6) {
    console.log('Form validation failed')
    return
  }

  isLoading.value = true

  try {
    const { error } = await client.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password
    })

    if (error) throw error

    console.log('Login successful, redirecting to home')
    navigateTo('/')
  } catch (error) {
    console.log('Login error:', error)
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

const handleGoogleSignIn = async () => {
  try {
    const redirectTo = `${config.public.siteUrl}/`
    const options = { provider: 'google', options: { redirectTo } }
    console.log('[GoogleSignIn] config.public.siteUrl:', config.public.siteUrl)
    console.log('[GoogleSignIn] redirectTo:', redirectTo)
    console.log('[GoogleSignIn] options:', options)

    const { data, error } = await client.auth.signInWithOAuth(options)
    console.log('[GoogleSignIn] Supabase response:', { data, error })
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
</script> 