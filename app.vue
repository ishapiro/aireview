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
</script> 