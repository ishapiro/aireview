<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">All Tags</h1>
    <div v-if="categories && categories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/categories/${category.slug}`"
        class="group block bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-200 p-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-400 no-underline"
        @click.native="logCategory(category)"
      >
        <div>
          <img
            v-if="category.image_url"
            :src="category.image_url"
            :alt="category.name"
            class="w-full h-40 object-cover rounded-t-xl"
            @error="$event.target.style.display = 'none'"
          />
          <div v-else class="w-full h-40 bg-gray-200 flex items-center justify-center rounded-t-xl">
            <i class="pi pi-image text-4xl text-gray-400"></i>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{{ category.name }}</h3>
          <p class="text-sm text-gray-500 mb-0 line-clamp-3">{{ category.description }}</p>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="text-center text-gray-500 py-12">
      <i class="pi pi-image text-4xl mb-4"></i>
      <p class="text-lg">No tags found.</p>
    </div>
  </div>
</template>

<script setup>
import { useCategories } from '~/composables/useCategories'

definePageMeta({
  layout: 'default',
  name: 'All Tags',
  breadcrumb: 'All Tags'
})

const { data: categories } = useCategories()

function logCategory(category) {
  console.log('Category clicked:', category.name, 'Slug:', category.slug)
}
</script> 