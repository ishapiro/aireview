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
        const profileData = {
          id: user.id,
          full_name: user.user_metadata.full_name || `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim(),
          email: user.email,
          avatar_url: user.user_metadata.avatar_url || null
        }

        // Clean up the full_name if it's empty
        if (!profileData.full_name || profileData.full_name.trim() === '') {
          profileData.full_name = user.email.split('@')[0] // Use email prefix as fallback
        }

        const { error: profileError } = await client
          .from('profiles')
          .insert(profileData)

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