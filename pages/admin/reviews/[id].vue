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

            <!-- Category -->
            <div class="field mb-4">
              <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
              <Dropdown
                id="category"
                v-model="form.category_id"
                :options="categories"
                option-label="name"
                option-value="id"
                placeholder="Select a category"
                class="w-full"
                required
              />
            </div>

            <!-- Content -->
            <div class="field mb-4">
              <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
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
            </div>
          </form>
        </div>
      </template>
    </Card>

    <Toast />

    <div v-if="form === null" class="p-6 bg-red-50 border border-red-200 rounded text-red-700 mt-8">
      <strong>Error:</strong> Review not found or you do not have access.<br />
      Please check the review ID or your permissions.
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import { format } from 'date-fns'

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const review = ref(null)
const form = ref({
  title: '',
  content: '',
  category_id: null,
  rating: null,
  is_published: true,
  ai_generated: false
})

const isSubmitting = ref(false)

// Fetch categories
const { data: categories } = await useAsyncData('categories', async () => {
  const { data } = await client
    .from('categories')
    .select('*')
    .order('name')
  return data
})

// Fetch review by ID with author information
onMounted(async () => {
  const reviewId = route.params.id
  console.log('[admin/reviews/[id]] Attempting to fetch review with ID:', reviewId)
  const { data, error } = await client
    .from('reviews')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('id', reviewId)
    .single()
  console.log('[admin/reviews/[id]] Fetch result:', data, 'Error:', error)
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
    content: data.content,
    category_id: data.category_id,
    rating: data.rating,
    is_published: data.is_published,
    ai_generated: data.ai_generated
  }
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const handleSubmit = async () => {
  isSubmitting.value = true
  const reviewId = route.params.id
  try {
    const { error } = await client
      .from('reviews')
      .update({
        title: form.value.title,
        slug: generateSlug(form.value.title),
        content: form.value.content,
        category_id: form.value.category_id,
        rating: form.value.rating,
        is_published: form.value.is_published,
        ai_generated: form.value.ai_generated
      })
      .eq('id', reviewId)
    if (error) throw error
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Review ${form.value.is_published ? 'published' : 'saved as draft'} successfully`,
      life: 3000
    })
    router.push('/admin/reviews')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  } finally {
    isSubmitting.value = false
  }
}

const handlePublishToggle = async () => {
  form.value.is_published = !form.value.is_published
  await handleSubmit()
}
</script> 