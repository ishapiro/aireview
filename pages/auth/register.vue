<template>
  <div class="max-w-md mx-auto">
    <Card>
      <template #title>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900">Create your account</h1>
          <p class="mt-2 text-gray-600">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-500">
              Sign in
            </NuxtLink>
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleRegister" class="space-y-4">
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
              toggleMask
              required
            />
          </div>

          <div class="field">
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm password</label>
            <Password
              id="confirm-password"
              v-model="form.confirmPassword"
              class="w-full"
              :feedback="false"
              toggleMask
              required
            />
          </div>

          <div class="field">
            <div class="flex items-start">
              <Checkbox
                id="terms"
                v-model="form.acceptTerms"
                :binary="true"
                :class="{ 'p-invalid': form.acceptTerms === false }"
              />
              <label for="terms" class="ml-2 block text-sm text-gray-700">
                I agree to the
                <NuxtLink to="/terms" class="text-primary-600 hover:text-primary-500">Terms of Service</NuxtLink>
                and
                <NuxtLink to="/privacy" class="text-primary-600 hover:text-primary-500">Privacy Policy</NuxtLink>
              </label>
            </div>
            <small v-if="form.acceptTerms === false" class="p-error">You must accept the terms and conditions</small>
          </div>

          <div class="flex justify-center">
            <Button
              type="submit"
              :loading="isLoading"
              label="Create Account"
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

          <div class="mt-6 grid grid-cols-2 gap-3">
            <Button
              @click="handleSocialLogin('github')"
              class="w-full"
              severity="secondary"
              icon="pi pi-github"
              label="GitHub"
            />
            <Button
              @click="handleSocialLogin('google')"
              class="w-full"
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
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const isLoading = ref(false)

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Passwords do not match',
      life: 3000
    })
    return
  }

  if (!form.value.acceptTerms) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'You must accept the terms and conditions',
      life: 3000
    })
    return
  }

  isLoading.value = true

  try {
    const { error: signUpError, data } = await client.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          full_name: form.value.fullName
        }
      }
    })

    if (signUpError) throw signUpError

    // Create user profile
    const { error: profileError } = await client
      .from('profiles')
      .insert({
        id: data.user.id,
        full_name: form.value.fullName,
        email: form.value.email
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