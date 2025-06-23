<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Edit Review</h1>
      <NuxtLink to="/admin/reviews">
        <Button label="Back to Reviews" icon="pi pi-arrow-left" />
      </NuxtLink>
    </div>

    <Card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Review Information</h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Status:</span>
            <Tag
              :value="form.is_published ? 'Published' : 'Draft'"
              :severity="form.is_published ? 'success' : 'warning'"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div class="space-y-6">
          <!-- Read-only Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Created</label>
              <div class="text-sm text-gray-900">{{ formatDate(review?.created_at) }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <div class="text-sm text-gray-900">{{ formatDate(review?.updated_at) }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Views</label>
              <div class="text-sm text-gray-900">{{ review?.views_count || 0 }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Helpful Votes</label>
              <div class="text-sm text-gray-900">{{ review?.helpful_count || 0 }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Author</label>
              <div class="text-sm text-gray-900">{{ review?.author?.full_name }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Slug</label>
              <div class="text-sm text-gray-900">{{ review?.slug }}</div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- Title -->
            <div class="field mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <InputText
                id="title"
                v-model="form.title"
                class="w-full"
                required
              />
            </div>

            <!-- Summary -->
            <div class="field mb-4">
              <label for="summary" class="block text-sm font-medium text-gray-700">Summary</label>
              <Textarea
                id="summary"
                v-model="form.summary"
                rows="3"
                class="w-full"
                placeholder="Enter a brief summary of your review (optional)"
              />
            </div>

            <!-- Category -->
            <div class="field mb-4">
              <label for="category" class="block text-sm font-medium text-gray-700">Categories</label>
              <MultiSelect
                id="category"
                v-model="form.category_ids"
                :options="categories"
                option-label="name"
                option-value="id"
                placeholder="Select categories"
                class="w-full"
                display="chip"
              />
            </div>

            <!-- Content -->
            <div class="field mb-4">
              <div class="flex items-center justify-between mb-2">
                <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
                <AIContentGenerator
                  v-model="form.content"
                  :summary-value="form.summary"
                  :generate-summary="true"
                  :title="form.title"
                  :rating-value="form.rating"
                  mode="edit"
                  @update:summary-value="form.summary = $event"
                  @update:rating-value="form.rating = $event"
                  @ai-generated="form.ai_generated = true"
                />
              </div>
              <Textarea
                id="content"
                v-model="form.content"
                rows="10"
                class="w-full"
                required
              />
            </div>

            <!-- Rating -->
            <div class="field mb-4">
              <label for="rating" class="block text-sm font-medium text-gray-700">Rating</label>
              <Dropdown
                id="rating"
                v-model="form.rating"
                :options="[1,2,3,4,5]"
                placeholder="Select a rating"
                class="w-full"
                required
              />
            </div>

            <!-- Published Toggle -->
            <div class="field mb-6">
              <div class="flex items-center">
                <InputSwitch
                  v-model="form.is_published"
                  class="mr-2"
                />
                <label class="text-sm font-medium text-gray-700">Published</label>
              </div>
              <p class="mt-1 text-sm text-gray-500">
                {{ form.is_published ? 'This review is visible to the public' : 'This review is currently in draft mode' }}
              </p>
            </div>

            <!-- AI Generated Toggle -->
            <div class="field mb-6">
              <div class="flex items-center">
                <InputSwitch
                  v-model="form.ai_generated"
                  class="mr-2"
                />
                <label class="text-sm font-medium text-gray-700">AI Generated</label>
              </div>
              <p class="mt-1 text-sm text-gray-500">
                Mark this review as created with AI assistance
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-4">
              <Button
                type="submit"
                :loading="isSubmitting"
                :label="form.is_published ? 'Update & Publish' : 'Update as Draft'"
              />
              <Button
                type="button"
                :label="form.is_published ? 'Unpublish' : 'Publish'"
                @click="handlePublishToggle"
              />
              <div v-if="!form.is_published" class="flex items-center space-x-2">
                <Button
                  type="button"
                  label="Delete Review"
                  severity="danger"
                  icon="pi pi-trash"
                  @click="handleDelete"
                />
                <span class="text-xs text-gray-500">(Only available for unpublished reviews)</span>
              </div>
            </div>
          </form>
        </div>
      </template>
    </Card>

    <Toast />
    <ConfirmDialog class="w-4/5" />

    <div v-if="form === null" class="p-6 bg-red-50 border border-red-200 rounded text-red-700 mt-8">
      <strong>Error:</strong> Review not found or you do not have access.<br />
      Please check the review ID or your permissions.
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { format } from 'date-fns'
import MultiSelect from 'primevue/multiselect'
import { onBeforeRouteLeave } from 'vue-router'
import { computed, nextTick } from 'vue'

definePageMeta({
  middleware: ['auth-admin']
})

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const confirm = useConfirm()
const router = useRouter()
const route = useRoute()

const review = ref(null)
const form = ref({
  title: '',
  summary: '',
  content: '',
  category_ids: [],
  rating: null,
  is_published: true,
  ai_generated: false
})

const isSubmitting = ref(false)
let initialFormState = ''

const hasChanged = computed(() => {
  if (!form.value) return false
  return JSON.stringify(form.value) !== initialFormState
})

// Fetch categories
const { data: categories } = await useAsyncData('categories', async () => {
  const { data } = await client
    .from('categories')
    .select('*')
    .order('name')
  return data
})

// Fetch review by ID with author and categories
onMounted(async () => {
  const reviewId = route.params.id
  const { data, error } = await client
    .from('reviews')
    .select(`
      *,
      author:profiles(*),
      review_categories(category_id)
    `)
    .eq('id', reviewId)
    .single()

  if (error || !data) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'Review not found',
      life: 5000
    })
    form.value = null
    return
  }
  review.value = data
  form.value = {
    title: data.title,
    summary: data.summary,
    content: data.content,
    category_ids: data.review_categories.map(rc => rc.category_id),
    rating: data.rating,
    is_published: data.is_published,
    ai_generated: data.ai_generated
  }
  
  // Store initial state
  nextTick(() => {
    initialFormState = JSON.stringify(form.value)
  })
  
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const handleBeforeUnload = (event) => {
  if (hasChanged.value) {
    event.preventDefault()
    event.returnValue = ''
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (hasChanged.value) {
    confirm.require({
      message: 'You have unsaved changes. Are you sure you want to leave?',
      header: 'Unsaved Changes',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        next()
      },
      reject: () => {
        next(false)
      },
    })
  } else {
    next()
  }
})

const handleSubmit = async () => {
  if (!form.value || isSubmitting.value) return
  isSubmitting.value = true

  try {
    const { error } = await client.rpc('update_review_with_categories', {
      review_id: route.params.id,
      new_title: form.value.title,
      new_summary: form.value.summary,
      new_content: form.value.content,
      new_rating: form.value.rating,
      new_is_published: form.value.is_published,
      new_ai_generated: form.value.ai_generated,
      new_category_ids: form.value.category_ids
    })

    if (error) throw error

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Review updated successfully',
      life: 3000
    })
    
    // Reset initial state
    initialFormState = JSON.stringify(form.value)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error updating review',
      detail: error.message,
      life: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}

const handlePublishToggle = async () => {
  form.value.is_published = !form.value.is_published
  await handleSubmit()
}

const handleDelete = async () => {
  confirm.require({
    message: 'Are you sure you want to delete this review? This action cannot be undone.',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        const { error } = await client
          .from('reviews')
          .delete()
          .eq('id', route.params.id)
        
        if (error) throw error

        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Review deleted successfully',
          life: 3000
        })
        
        initialFormState = JSON.stringify(form.value) // Reset to prevent confirm dialog
        router.push('/admin/reviews')
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete review.',
          life: 3000
        })
      }
    }
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'MMMM d, yyyy')
}
</script> 