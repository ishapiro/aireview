<template>
  <div style="color: blue;">DYNAMIC TEST PAGE: {{ $route.params.slug }}</div>
</template>
<script setup>
const route = useRoute()

definePageMeta({
  layout: 'default',
  name: 'Test',
  breadcrumb: 'Test'
})

console.log('DYNAMIC TEST PAGE:', route.params.slug)
</script> 