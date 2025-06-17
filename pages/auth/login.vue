<template>
  <div class="max-w-md mx-auto">
    <Card>
      <template #title>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p class="mt-2 text-gray-600">
            Don't have an account?
            <NuxtLink to="/auth/register" class="text-primary-600 hover:text-primary-500">
              Sign up
            </NuxtLink>
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="field">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              class="w-full"
              required
            />
          </div>

          <div class="field">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <Password
              id="password"
              v-model="form.password"
              class="w-full"
              :feedback="false"
              toggleMask
              required
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Checkbox
                id="remember"
                v-model="form.remember"
                :binary="true"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <div class="flex justify-center">
            <Button
              type="submit"
              :loading="isLoading"
              label="Sign in"
              class="w-full"
            />
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6 flex justify-center">
            <Button
              @click="handleSocialLogin('google')"
              class="w-full max-w-xs"
              severity="secondary"
              icon="pi pi-google"
              label="Google"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Toast for error messages -->
    <Toast />
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

const isLoading = ref(false)

const handleLogin = async () => {
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

const handleSocialLogin = async (provider) => {
  try {
    const { error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`
      }
    })

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