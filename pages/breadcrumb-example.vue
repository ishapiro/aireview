<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">Breadcrumb System Example</h1>
    
    <div class="space-y-6">
      <Card>
        <template #content>
          <h2 class="text-xl font-semibold mb-4">Current Breadcrumbs</h2>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">The breadcrumbs above show:</p>
            <ul class="list-disc list-inside text-sm space-y-1">
              <li v-for="(crumb, index) in breadcrumbs" :key="index">
                <span class="font-medium">{{ crumb.label }}</span>
                <span v-if="crumb.to" class="text-gray-500"> → {{ crumb.to }}</span>
              </li>
            </ul>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <h2 class="text-xl font-semibold mb-4">Breadcrumb Features</h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-medium text-gray-900">1. Automatic Route Detection</h3>
              <p class="text-sm text-gray-600">Breadcrumbs are automatically generated based on the current route path.</p>
            </div>
            
            <div>
              <h3 class="font-medium text-gray-900">2. Dynamic Content</h3>
              <p class="text-sm text-gray-600">Pages can set custom breadcrumbs using the <code>setBreadcrumbs()</code> function.</p>
            </div>
            
            <div>
              <h3 class="font-medium text-gray-900">3. Meta-based Configuration</h3>
              <p class="text-sm text-gray-600">Pages can define breadcrumbs in their <code>definePageMeta()</code>.</p>
            </div>
            
            <div>
              <h3 class="font-medium text-gray-900">4. Accessibility</h3>
              <p class="text-sm text-gray-600">Proper ARIA labels and semantic HTML for screen readers.</p>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <h2 class="text-xl font-semibold mb-4">Test Dynamic Breadcrumbs</h2>
          <div class="space-y-4">
            <Button 
              @click="setCustomBreadcrumbs" 
              label="Set Custom Breadcrumbs"
              class="mr-2"
            />
            <Button 
              @click="clearBreadcrumbs" 
              label="Clear Custom Breadcrumbs"
              severity="secondary"
            />
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <h2 class="text-xl font-semibold mb-4">Navigation Examples</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink 
              to="/reviews/test-review" 
              class="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 class="font-medium">Review Page</h3>
              <p class="text-sm text-gray-600">Shows: Home → Reviews → [Review Title]</p>
            </NuxtLink>
            
            <NuxtLink 
              to="/categories/technology" 
              class="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 class="font-medium">Category Page</h3>
              <p class="text-sm text-gray-600">Shows: Home → Categories → [Category Name]</p>
            </NuxtLink>
            
            <NuxtLink 
              to="/admin/reviews/new" 
              class="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 class="font-medium">Admin New Review</h3>
              <p class="text-sm text-gray-600">Shows: Home → Admin → Reviews → New Review</p>
            </NuxtLink>
            
            <NuxtLink 
              to="/search" 
              class="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 class="font-medium">Search Page</h3>
              <p class="text-sm text-gray-600">Shows: Home → Search</p>
            </NuxtLink>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { useBreadcrumbs } from '~/composables/useBreadcrumbs'

definePageMeta({
  layout: 'default',
  name: 'Breadcrumb Example',
  breadcrumb: 'Breadcrumb Example'
})

const { breadcrumbs, setBreadcrumbs, clearDynamicBreadcrumbs } = useBreadcrumbs()

const setCustomBreadcrumbs = () => {
  setBreadcrumbs([
    {
      label: 'Custom Section',
      to: '/custom'
    },
    {
      label: 'Dynamic Page',
      to: '/custom/dynamic'
    },
    {
      label: 'Current Page'
    }
  ])
}

const clearBreadcrumbs = () => {
  clearDynamicBreadcrumbs()
}
</script> 