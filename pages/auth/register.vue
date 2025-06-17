<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-0 p-4">
    <div class="max-w-xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-semibold text-surface-900 mb-3">Create your account</h1>
        <p class="text-surface-600">Fill in the details below to get started.</p>
      </div>

      <Card class="bg-surface-50 shadow-md">
        <template #content>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="first-name" class="block text-sm text-surface-600 mb-1">First Name</label>
                <InputText
                  id="first-name"
                  v-model="form.firstName"
                  placeholder="e.g. John"
                  :class="{ 'p-invalid': submitted && !form.firstName }"
                  class="w-full bg-surface-0"
                />
                <small class="text-red-500" v-if="submitted && !form.firstName">First name is required</small>
              </div>

              <div>
                <label for="last-name" class="block text-sm text-surface-600 mb-1">Last Name</label>
                <InputText
                  id="last-name"
                  v-model="form.lastName"
                  placeholder="e.g. Smith"
                  :class="{ 'p-invalid': submitted && !form.lastName }"
                  class="w-full bg-surface-0"
                />
                <small class="text-red-500" v-if="submitted && !form.lastName">Last name is required</small>
              </div>
            </div>

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
            </div>

            <!-- Optional Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="phone" class="block text-sm text-surface-600 mb-1">Phone (Optional)</label>
                <InputText
                  id="phone"
                  v-model="form.phone"
                  placeholder="+00 0000 000 0000"
                  class="w-full bg-surface-0"
                />
              </div>

              <div>
                <label for="website" class="block text-sm text-surface-600 mb-1">Website (Optional)</label>
                <InputText
                  id="website"
                  v-model="form.website"
                  placeholder="e.g. https://google.com"
                  class="w-full bg-surface-0"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm text-surface-600 mb-1">Password</label>
              <Password
                id="password"
                v-model="form.password"
                placeholder="Your Password"
                :feedback="false"
                toggleMask
                :class="{ 'p-invalid': submitted && !form.password }"
                class="w-full bg-surface-0"
              />
              <small class="text-red-500" v-if="submitted && !form.password">Password is required</small>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirm-password" class="block text-sm text-surface-600 mb-1">Confirm Password</label>
              <Password
                id="confirm-password"
                v-model="form.confirmPassword"
                placeholder="Confirm Password"
                :feedback="false"
                toggleMask
                :class="{ 'p-invalid': submitted && !form.confirmPassword }"
                class="w-full bg-surface-0"
              />
              <small class="text-red-500" v-if="submitted && !form.confirmPassword">Please confirm your password</small>
            </div>

            <!-- Terms -->
            <div class="flex items-start space-x-2">
              <Checkbox v-model="form.terms" :binary="true" inputId="terms" />
              <label for="terms" class="text-sm text-surface-600">
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

            <!-- Links -->
            <div class="text-center text-sm">
              <NuxtLink to="/auth/login" class="text-primary hover:text-primary-600">
                Already have an account? Sign in
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
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  website: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const submitted = ref(false)
const isLoading = ref(false)

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
        website: form.value.website
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
</script> 