<template>
  <nav aria-label="Breadcrumb" class="bg-gray-50 border-b border-gray-200">
    <ol class="max-w-7xl mx-auto flex items-center space-x-2 px-4 sm:px-6 lg:px-8 py-2 text-sm text-gray-500 list-none">
      <li v-for="(crumb, index) in breadcrumbs" :key="`${crumb.label}-${index}`" class="flex items-center">
        <!-- Separator (except for first item) -->
        <svg 
          v-if="index > 0" 
          class="w-4 h-4 mx-2 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        
        <!-- Breadcrumb item -->
        <NuxtLink
          v-if="crumb.to && index < breadcrumbs.length - 1"
          :to="crumb.to"
          class="font-medium text-blue-500 hover:text-blue-700 no-underline flex items-center"
        >
          <i v-if="crumb.icon" :class="`${crumb.icon} mr-1`"></i>
          {{ crumb.label }}
        </NuxtLink>
        <span 
          v-else 
          class="text-gray-700 font-semibold flex items-center"
        >
          <i v-if="crumb.icon" :class="`${crumb.icon} mr-1`"></i>
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { useBreadcrumbs } from '~/composables/useBreadcrumbs'

const { breadcrumbs } = useBreadcrumbs()
</script> 