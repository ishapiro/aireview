<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-0 p-4">
    <div class="max-w-xl w-full text-center">
      <h1 class="text-4xl font-bold text-surface-900 mb-4">404</h1>
      <p class="text-surface-600 mb-8">Page not found</p>
      <NuxtLink to="/">
        <Button label="Go Home" icon="pi pi-home" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// This is a catch-all route that will handle any unknown paths
// including the Chrome DevTools path
</script> 