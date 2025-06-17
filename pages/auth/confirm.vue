<template>
  <div class="max-w-md mx-auto">
    <Card>
      <template #content>
        <div class="text-center space-y-4">
          <ProgressSpinner />
          <p class="text-gray-600">Completing sign in...</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
const client = useSupabaseClient()

onMounted(async () => {
  try {
    const { data: { user }, error } = await client.auth.getUser()
    
    if (error) throw error

    if (user) {
      // Check if profile exists
      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Create profile if it doesn't exist
      if (!profile) {
        const { error: profileError } = await client
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata.full_name,
            email: user.email,
            avatar_url: user.user_metadata.avatar_url
          })

        if (profileError) throw profileError
      }

      navigateTo('/')
    }
  } catch (error) {
    console.error('Error during OAuth confirmation:', error)
    navigateTo('/auth/login')
  }
})
</script> 