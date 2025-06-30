<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Global error handling
onErrorCaptured((err, instance, info) => {
  console.error('Error:', err)
  console.error('Component:', instance)
  console.error('Info:', info)
  return false // prevents error from propagating
})

// Host and port check on app initialization
onMounted(() => {
  // Only run this check in the browser
  if (process.client) {
    const host = window.location.hostname
    const port = window.location.port
    
    // Check if host is localhost but port is not 3000
    if (host === 'localhost' && port !== '3000') {
      alert(`Warning: App is running on localhost:${port} instead of localhost:3000. This may cause issues with authentication and other features.`)
    }
  }
})
</script> 