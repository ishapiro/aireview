<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Create New Review</h1>
      <NuxtLink to="/admin/reviews">
        <Button label="Back to Reviews" icon="pi pi-arrow-left" />
      </NuxtLink>
    </div>

    <Card>
      <template #content>
        <div class="space-y-6">
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <InputText
                id="title"
                v-model="form.title"
                class="w-full"
                required
              />
            </div>

            <div class="field">
              <label for="summary" class="block text-sm font-medium text-gray-700">Summary</label>
              <Textarea
                id="summary"
                v-model="form.summary"
                rows="3"
                class="w-full"
                placeholder="Enter a brief summary of your review (optional)"
              />
            </div>

            <div class="field">
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

            <div class="field">
              <div class="flex items-center justify-between mb-2">
                <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
                <AIContentGenerator
                  v-model="form.content"
                  :summary-value="form.summary"
                  :generate-summary="true"
                  @update:summary-value="form.summary = $event"
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

            <div class="field">
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

            <div class="field">
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

            <div class="flex items-center space-x-4 mt-6">
              <Button
                type="submit"
                :loading="isSubmitting"
                label="Create Review"
              />
              <Button
                type="button"
                label="Save as Draft"
                @click="handleSaveAsDraft"
              />
            </div>
          </form>
        </div>
      </template>
    </Card>

    <Toast />
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const router = useRouter()

const form = ref({
  title: '',
  summary: '',
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

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    const { error } = await client
      .from('reviews')
      .insert({
        title: form.value.title,
        slug: generateSlug(form.value.title),
        summary: form.value.summary,
        content: form.value.content,
        category_id: form.value.category_id,
        rating: form.value.rating,
        user_id: user.value.id,
        is_published: form.value.is_published,
        ai_generated: form.value.ai_generated
      })

    if (error) throw error

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Review created successfully',
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

const handleSaveAsDraft = () => {
  form.value.is_published = false
  handleSubmit()
}
</script> 