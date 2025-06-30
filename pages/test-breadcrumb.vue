<template>
  <div class="max-w-2xl mx-auto py-12">
    <h1 class="text-3xl font-bold mb-6">Test Breadcrumb Page</h1>
    <p class="text-lg">This is a test page to debug Nuxt route meta and breadcrumb functionality.</p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
  name: 'TestBreadcrumb',
  breadcrumb: 'Test Crumb!'
})
console.log('[test-breadcrumb.vue] Test page loaded')
</script> 