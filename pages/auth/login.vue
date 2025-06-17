<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-0 p-4">
    <div class="max-w-xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-semibold text-surface-900 mb-3">Sign In</h1>
        <p class="text-surface-600">Welcome back! Please enter your details.</p>
      </div>

      <Card class="bg-surface-50 shadow-md">
        <template #content>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm text-surface-600 mb-1">Email Address</label>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                placeholder="e.g. john@your-domain.com"
                :class="{ 'p-invalid': submitted && !form.email }"
                class="w-full bg-surface-0"
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

            <!-- Links -->
            <div class="text-center text-sm">
              <NuxtLink to="/auth/register" class="text-primary-600 hover:text-primary-500">
                Don't have an account? Sign up
              </NuxtLink>
            </div>
          </form>
        </template>
      </Card>

      <!-- Toast for notifications -->
      <Toast position="top-center" />
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

// Redirect if already logged in
if (user.value) {
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
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailPattern.test(email)
}

const handleSubmit = async () => {
  submitted.value = true

  if (!form.value.email || !form.value.password || !isValidEmail(form.value.email) || form.value.password.length < 6) {
    return
  }

  isLoading.value = true

  try {
    const { error } = await client.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password
    })

    if (error) throw error

    navigateTo('/')
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
</script> 