<template>
  <div class="min-h-screen flex items-center justify-center bg-white p-4">
    <div class="max-w-xl w-full">
      <!-- Header - only show if no Google account detected -->
      <div v-if="!hasExistingGoogleAccount" class="text-center mb-8">
        <h1 class="text-3xl font-semibold text-gray-800 mb-3">Check your email</h1>
        <p class="text-gray-500">We've sent you a verification link.</p>
      </div>

      <!-- Warning about existing Google account -->
      <div v-if="hasExistingGoogleAccount" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-start">
          <i class="pi pi-exclamation-triangle text-yellow-600 mr-3 mt-1"></i>
          <div>
            <h3 class="text-sm font-medium text-yellow-800 mb-1">Existing Google Account Detected</h3>
            <p class="text-sm text-yellow-700 mb-3">
              We found that you already have an account with this email address that was created using Google Sign-In. 
              You may have created a duplicate account.
            </p>
            <div class="space-y-2">
              <Button
                @click="handleGoogleSignIn"
                label="Sign in with Google instead"
                icon="pi pi-google"
                class="w-full p-button-outlined p-button-warning"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Email verification content - only show if no Google account detected -->
      <div v-if="!hasExistingGoogleAccount" class="space-y-8">
        <!-- Icon -->
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
            <i class="pi pi-envelope text-4xl text-primary-600"></i>
          </div>
        </div>

        <!-- Message -->
        <div class="text-center space-y-4">
          <p class="text-gray-600">
            Please check your inbox and click the verification link to verify your account.
          </p>
          <p class="text-gray-600">
            If you haven't received the email, click below to resend.
          </p>
        </div>

        <!-- Actions -->
        <div class="space-y-4">
          <Button
            @click="handleResendEmail"
            :loading="isResending"
            label="Resend verification email"
            class="w-full p-button-primary"
          />

          <Button
            @click="handleSignOut"
            label="Sign out"
            class="w-full p-button-outlined"
          />
        </div>
      </div>

      <!-- Toast for notifications -->
      <Toast position="top-center" />
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'default',
  name: 'Verify Email',
  breadcrumb: 'Verify Email'
})

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const config = useRuntimeConfig()

// Store email in localStorage if user is not logged in yet
const email = ref('')
const hasExistingGoogleAccount = ref(false)
const isResending = ref(false)

onMounted(async () => {
  // Check if we have email in localStorage (from registration)
  const storedEmail = localStorage.getItem('registration_email')
  if (storedEmail) {
    email.value = storedEmail
  }
  
  // If user is logged in, use their email
  if (user.value?.email) {
    email.value = user.value.email
  }

  // Check if we have a flag indicating this might be a duplicate account
  const isDuplicateAccount = localStorage.getItem('duplicate_account_warning')
  if (isDuplicateAccount === 'true') {
    hasExistingGoogleAccount.value = true
    localStorage.removeItem('duplicate_account_warning')
  }
})

const handleGoogleSignIn = async () => {
  try {
    const redirectTo = `${config.public.siteUrl}/`
    const options = { provider: 'google', options: { redirectTo } }
    console.log('[GoogleSignIn] Redirecting to Google OAuth...')
    const { data, error } = await client.auth.signInWithOAuth(options)
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

const handleResendEmail = async () => {
  if (!email.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No email address found. Please try registering again.',
      life: 3000
    })
    return
  }

  isResending.value = true

  try {
    console.log('Attempting to resend confirmation email to:', email.value)
    
    const { error } = await client.auth.resend({
      type: 'signup',
      email: email.value
    })

    console.log('Resend response:', { error })

    if (error) throw error

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Verification email sent! Check your inbox and spam folder.',
      life: 5000
    })
  } catch (error) {
    console.error('Resend email error:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  } finally {
    isResending.value = false
  }
}

const handleSignOut = async () => {
  // Clear stored email
  localStorage.removeItem('registration_email')
  await client.auth.signOut()
  navigateTo('/auth/login')
}
</script> 