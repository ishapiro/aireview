<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
      <Button @click="showDialog = true" label="Add Category" icon="pi pi-plus" />
    </div>

    <Card>
      <template #content>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name / Slug
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviews
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="category in categories" :key="category.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-16 h-16">
                    <img 
                      v-if="category.image_url" 
                      :src="category.image_url" 
                      :alt="category.name"
                      class="w-16 h-16 object-cover rounded"
                      @error="$event.target.style.display = 'none'"
                    />
                    <div v-else class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <i class="pi pi-image text-gray-400"></i>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="mb-1">
                    <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                    <div class="text-sm text-gray-500">{{ category.slug }}</div>
                  </div>
                  <div class="text-sm text-gray-700 mt-2">{{ category.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                       :class="category.review_count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'">
                    {{ category.review_count || 0 }} {{ category.review_count === 1 ? 'review' : 'reviews' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="handleEdit(category)"
                    class="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDelete(category.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Card>

    <!-- Category Dialog -->
    <Dialog
      v-model:visible="showDialog"
      :modal="true"
      :header="editingCategory ? 'Edit Category' : 'Add Category'"
      class="p-fluid"
    >
      <template #default>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="field">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <InputText
              id="name"
              v-model="form.name"
              required
            />
          </div>

          <div class="field">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              id="description"
              v-model="form.description"
              rows="3"
            />
          </div>

          <div class="field">
            <label class="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
            <div class="flex items-center space-x-4">
              <div class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <img
                  v-if="form.image_url"
                  :src="form.image_url"
                  class="w-32 h-32 object-cover rounded-lg"
                />
                <div v-else class="text-center">
                  <i class="pi pi-image text-3xl text-gray-400 mb-2"></i>
                  <p class="text-sm text-gray-500">No image</p>
                </div>
              </div>
              <div class="flex flex-col space-y-2">
                <Button
                  type="button"
                  label="Upload Image"
                  icon="pi pi-upload"
                  @click="handleImageUpload"
                  class="btn-secondary"
                />
                <Button
                  v-if="form.image_url"
                  type="button"
                  label="Remove Image"
                  icon="pi pi-trash"
                  severity="danger"
                  @click="form.image_url = ''"
                  class="btn-secondary"
                />
              </div>
            </div>
          </div>
        </form>
      </template>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="showDialog = false"
          class="mr-2"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          @click="handleSubmit"
          :loading="isSubmitting"
        />
      </template>
    </Dialog>

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useImageUpload } from '@/composables/useImageUpload'

const client = useSupabaseClient()
const toast = useToast()
const confirm = useConfirm()
const { uploadCategoryImage } = useImageUpload()

const showDialog = ref(false)
const isSubmitting = ref(false)
const editingCategory = ref(null)

const form = ref({
  name: '',
  description: '',
  image_url: ''
})

// Fetch categories with review counts
const { data: categories } = await useAsyncData('admin-categories', async () => {
  const { data } = await client
    .from('categories')
    .select(`
      *,
      review_count:review_categories(count)
    `)
    .order('name')
  
  // Transform the data to flatten the review count
  return data?.map(category => ({
    ...category,
    review_count: category.review_count?.[0]?.count || 0
  })) || []
})

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const handleEdit = (category) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    description: category.description || '',
    image_url: category.image_url || ''
  }
  showDialog.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    const categoryData = {
      name: form.value.name,
      slug: generateSlug(form.value.name),
      description: form.value.description,
      image_url: form.value.image_url
    }

    let error

    if (editingCategory.value) {
      // Update existing category
      const response = await client
        .from('categories')
        .update(categoryData)
        .eq('id', editingCategory.value.id)
      error = response.error
    } else {
      // Create new category
      const response = await client
        .from('categories')
        .insert(categoryData)
      error = response.error
    }

    if (error) throw error

    // Refresh categories list
    const { data } = await client
      .from('categories')
      .select(`
        *,
        review_count:review_categories(count)
      `)
      .order('name')
    
    categories.value = data?.map(category => ({
      ...category,
      review_count: category.review_count?.[0]?.count || 0
    })) || []

    showDialog.value = false
    editingCategory.value = null
    form.value = { name: '', description: '', image_url: '' }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Category ${editingCategory.value ? 'updated' : 'created'} successfully`,
      life: 3000
    })
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

const handleDelete = (id) => {
  confirm.require({
    message: 'Are you sure you want to delete this category?',
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        const { error } = await client
          .from('categories')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Remove the category from the list
        categories.value = categories.value.filter(category => category.id !== id)

        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category deleted successfully',
          life: 3000
        })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000
        })
      }
    }
  })
}

const handleImageUpload = async () => {
  try {
    const publicUrl = await uploadCategoryImage()
    if (publicUrl) {
      form.value.image_url = publicUrl
    }
  } catch (error) {
    // Error handling is already done in the composable
    console.error('Error in handleImageUpload:', error)
  }
}
</script> 