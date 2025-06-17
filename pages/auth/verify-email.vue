<template>
  <div class="max-w-md mx-auto">
    <Card>
      <template #title>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900">Check your email</h1>
        </div>
      </template>

      <template #content>
        <div class="text-center space-y-4">
          <i class="pi pi-envelope text-4xl text-primary-600"></i>
          <p class="text-gray-600">
            We've sent you a verification link to your email address.
            Please check your inbox and click the link to verify your account.
          </p>

          <div class="space-y-4">
            <Button
              @click="handleResendEmail"
              :loading="isResending"
              label="Resend verification email"
              class="w-full"
            />

            <Button
              @click="handleSignOut"
              severity="secondary"
              label="Sign out"
              class="w-full"
            />
          </div>
        </div>
      </template>
    </Card>

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