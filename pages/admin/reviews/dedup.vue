<template>
  <div class="max-w-5xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-8">Review Deduplication (Admin)</h1>
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div v-if="groups.length === 0" class="text-gray-500 text-center py-12">
        No duplicate groups found.
      </div>
      <div v-for="(group, idx) in groups" :key="idx" class="mb-10 border rounded-lg p-6 bg-white shadow">
        <h2 class="text-xl font-semibold mb-4 text-blue-700">Similar Reviews Group {{ idx + 1 }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="review in group" :key="review.id" class="border rounded p-4 flex flex-col">
            <div class="font-bold text-lg mb-2">{{ review.title }}</div>
            <div class="text-gray-600 mb-2">{{ review.summary }}</div>
            <div class="text-xs text-gray-400 mb-2">Review ID: {{ review.id }}</div>
            <div class="flex-1"></div>
            <div class="flex space-x-2 mt-2">
              <NuxtLink :to="`/reviews/${review.slug}`" class="btn-primary" target="_blank">View</NuxtLink>
              <Button v-if="group.length > 1" severity="danger" icon="pi pi-trash" label="Delete as Duplicate" @click="() => handleDeleteDuplicate(review, group)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useToast } from 'primevue/usetoast'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'
import stringSimilarity from 'string-similarity'
import { navigateTo } from '#app'

definePageMeta({
  layout: 'default',
  middleware: ['auth-admin']
})

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const isLoading = ref(true)
const groups = ref([])

// Only allow admin
onMounted(async () => {
  if (!user.value) return navigateTo('/auth/login')
  const { data: profile } = await client.from('profiles').select('is_admin').eq('id', user.value.id).single()
  if (!profile?.is_admin) return navigateTo('/')
  await fetchAndGroupReviews()
})

async function fetchAndGroupReviews() {
  isLoading.value = true
  const { data: reviews, error } = await client
    .from('reviews')
    .select('id, title, summary, slug')
    .order('created_at', { ascending: false })
  if (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch reviews', life: 4000 })
    isLoading.value = false
    return
  }
  // Group similar reviews using string-similarity
  const used = new Set()
  const result = []
  for (let i = 0; i < reviews.length; i++) {
    if (used.has(reviews[i].id)) continue
    const group = [reviews[i]]
    for (let j = i + 1; j < reviews.length; j++) {
      if (used.has(reviews[j].id)) continue
      const sim = stringSimilarity.compareTwoStrings(reviews[i].title, reviews[j].title)
      if (sim > 0.7) {
        group.push(reviews[j])
        used.add(reviews[j].id)
      }
    }
    if (group.length > 1) {
      group.forEach(r => used.add(r.id))
      result.push(group)
    }
  }
  groups.value = result
  isLoading.value = false
}

async function handleDeleteDuplicate(duplicate, group) {
  // Find a replacement review from the group (not the one being deleted)
  const replacement = group.find(r => r.id !== duplicate.id)
  isLoading.value = true
  try {
    // 1. Remove from review_categories
    await client.from('review_categories').delete().eq('review_id', duplicate.id)
    // 2. Update user saved_lists: replace duplicate with replacement if possible
    const { data: listItems } = await client.from('saved_list_items').select('list_id, review_id').eq('review_id', duplicate.id)
    for (const item of listItems || []) {
      if (replacement) {
        // Check if replacement is already in the list
        const { count } = await client.from('saved_list_items').select('*', { count: 'exact', head: true }).eq('list_id', item.list_id).eq('review_id', replacement.id)
        if (count === 0) {
          // Replace duplicate with replacement
          await client.from('saved_list_items').update({ review_id: replacement.id }).eq('list_id', item.list_id).eq('review_id', duplicate.id)
        } else {
          // Just remove duplicate
          await client.from('saved_list_items').delete().eq('list_id', item.list_id).eq('review_id', duplicate.id)
        }
      } else {
        // No replacement, just remove
        await client.from('saved_list_items').delete().eq('list_id', item.list_id).eq('review_id', duplicate.id)
      }
    }
    // 3. Delete the review
    await client.from('reviews').delete().eq('id', duplicate.id)
    toast.add({ severity: 'success', summary: 'Deleted', detail: 'Duplicate review deleted and lists updated', life: 4000 })
    await fetchAndGroupReviews()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete duplicate', life: 4000 })
    isLoading.value = false
  }
}
</script> 