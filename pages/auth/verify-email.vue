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
            severity="secondary"
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
const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

// Redirect if not logged in
if (!user.value) {
  navigateTo('/auth/login')
}

const isResending = ref(false)

const handleResendEmail = async () => {
  isResending.value = true

  try {
    const { error } = await client.auth.resend({
      type: 'signup',
      email: user.value.email
    })

    if (error) throw error

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Verification email sent!',
      life: 3000
    })
  } catch (error) {
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
  await client.auth.signOut()
  navigateTo('/auth/login')
}
</script> 