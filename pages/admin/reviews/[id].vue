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
              <label for="category" class="block text-sm font-medium text-gray-700">Tags</label>
              <MultiSelect
                id="category"
                v-model="form.category_ids"
                :options="categories"
                option-label="name"
                option-value="id"
                placeholder="Select tags"
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
              <InputNumber
                id="rating"
                v-model="form.rating"
                :min="1.0"
                :max="5.0"
                :step="0.1"
                :minFractionDigits="1"
                :maxFractionDigits="1"
                placeholder="Enter rating (1.0 - 5.0)"
                class="w-full"
                required
              />
              <p class="mt-1 text-sm text-gray-500">
                Enter a rating between 1.0 and 5.0 (e.g., 4.5)
              </p>
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
import { computed, nextTick, watch } from 'vue'
import { useBreadcrumbs } from '~/composables/useBreadcrumbs'

definePageMeta({
  middleware: ['auth-admin']
})

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const confirm = useConfirm()
const router = useRouter()
const route = useRoute()
const { setBreadcrumbs } = useBreadcrumbs()

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
const { data: categories } = await useAsyncData('admin-review-categories', async () => {
  const { data } = await client
    .from('categories')
    .select('*')
    .order('name')
  return data
})

// Fetch review by ID with author and categories
onMounted(async () => {
  const reviewId = route.params.id
  
  try {
    // First, fetch the review with author
    const { data: reviewData, error: reviewError } = await client
      .from('reviews')
      .select(`
        *,
        author:profiles(*)
      `)
      .eq('id', reviewId)
      .single()

    if (reviewError || !reviewData) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: reviewError?.message || 'Review not found',
        life: 5000
      })
      form.value = null
      return
    }

    // Then, fetch the categories for this review
    const { data: categoryData, error: categoryError } = await client
      .from('review_categories')
      .select(`
        category_id,
        categories(*)
      `)
      .eq('review_id', reviewId)

    if (categoryError) {
      console.error('Error fetching categories:', categoryError)
      // Don't fail the whole load, just log the error
    }

    review.value = reviewData
    form.value = {
      title: reviewData.title,
      summary: reviewData.summary,
      content: reviewData.content,
      category_ids: categoryData ? categoryData.map(rc => rc.category_id) : [],
      rating: reviewData.rating,
      is_published: reviewData.is_published,
      ai_generated: reviewData.ai_generated
    }
    
    // Store initial state
    nextTick(() => {
      initialFormState = JSON.stringify(form.value)
    })
    
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Update breadcrumb when review is loaded
    setBreadcrumbs([
      {
        label: 'Admin',
        to: '/admin'
      },
      {
        label: 'Reviews',
        to: '/admin/reviews'
      },
      {
        label: reviewData.title || 'Edit Review'
      }
    ])
  } catch (error) {
    console.error('Error loading review:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load review data',
      life: 5000
    })
    form.value = null
  } finally {
    isLoading.value = false
  }
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
    // Debug: Log the form data being sent
    console.log('Form data being sent:', form.value)
    console.log('Rating type:', typeof form.value.rating, 'Value:', form.value.rating)
    
    // Ensure rating is a proper numeric value
    const ratingValue = parseFloat(form.value.rating)
    if (isNaN(ratingValue) || ratingValue < 1.0 || ratingValue > 5.0) {
      throw new Error('Rating must be a number between 1.0 and 5.0')
    }
    
    const updateData = {
      title: form.value.title,
      summary: form.value.summary,
      content: form.value.content,
      rating: ratingValue,
      is_published: form.value.is_published,
      ai_generated: form.value.ai_generated,
      updated_at: new Date().toISOString()
    }
    
    console.log('Update data:', updateData)
    console.log('Review ID:', route.params.id)
    
    // Try to get more detailed error information
    const { data: updateResult, error: reviewError } = await client
      .from('reviews')
      .update(updateData)
      .eq('id', route.params.id)
      .select()

    if (reviewError) {
      console.error('Review update error details:', {
        code: reviewError.code,
        message: reviewError.message,
        details: reviewError.details,
        hint: reviewError.hint
      })
      throw reviewError
    }

    console.log('Review update successful:', updateResult)

    // Update categories
    // First, remove existing categories
    const { error: deleteError } = await client
      .from('review_categories')
      .delete()
      .eq('review_id', route.params.id)

    if (deleteError) {
      console.error('Category delete error:', deleteError)
      throw deleteError
    }

    // Then, add new categories
    if (form.value.category_ids.length > 0) {
      const categoryInserts = form.value.category_ids.map(categoryId => ({
        review_id: route.params.id,
        category_id: categoryId
      }))

      const { error: insertError } = await client
        .from('review_categories')
        .insert(categoryInserts)

      if (insertError) {
        console.error('Category insert error:', insertError)
        throw insertError
      }
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Review updated successfully',
      life: 3000
    })
    
    // Reset initial state
    initialFormState = JSON.stringify(form.value)
  } catch (error) {
    console.error('Error updating review:', error)
    console.error('Full error object:', JSON.stringify(error, null, 2))
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

// Update breadcrumb when review is loaded
watch(review, (newReview) => {
  if (newReview) {
    setBreadcrumbs([
      {
        label: 'Admin',
        to: '/admin'
      },
      {
        label: 'Reviews',
        to: '/admin/reviews'
      },
      {
        label: newReview.title || 'Edit Review'
      }
    ])
  }
}, { immediate: true })
</script> 