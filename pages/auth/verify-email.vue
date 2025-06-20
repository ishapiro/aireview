<template>
  <div class="min-h-screen flex items-center justify-center bg-white p-4">
    <div class="max-w-xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-semibold text-gray-800 mb-3">Check your email</h1>
        <p class="text-gray-500">We've sent you a verification link.</p>
      </div>

      <div class="space-y-8">
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

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

// Store email in localStorage if user is not logged in yet
const email = ref('')

onMounted(() => {
  // Check if we have email in localStorage (from registration)
  const storedEmail = localStorage.getItem('registration_email')
  if (storedEmail) {
    email.value = storedEmail
  }
  
  // If user is logged in, use their email
  if (user.value?.email) {
    email.value = user.value.email
  }
})

const isResending = ref(false)

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