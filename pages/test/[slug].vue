<template>
  <div style="color: blue;">DYNAMIC TEST PAGE: {{ $route.params.slug }}</div>
</template>
<script setup>
const route = useRoute()
console.log('DYNAMIC TEST PAGE:', route.params.slug)
</script> 