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
                  Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="category in categories" :key="category.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ category.slug }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ category.description }}</div>
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
      </form>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="showDialog = false"
          severity="secondary"
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

const client = useSupabaseClient()
const toast = useToast()
const confirm = useConfirm()

const showDialog = ref(false)
const isSubmitting = ref(false)
const editingCategory = ref(null)

const form = ref({
  name: '',
  description: ''
})

// Fetch categories
const { data: categories } = await useAsyncData('admin-categories', async () => {
  const { data } = await client
    .from('categories')
    .select('*')
    .order('name')
  
  return data
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
    description: category.description || ''
  }
  showDialog.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    const categoryData = {
      name: form.value.name,
      slug: generateSlug(form.value.name),
      description: form.value.description
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
      .select('*')
      .order('name')
    
    categories.value = data

    showDialog.value = false
    editingCategory.value = null
    form.value = { name: '', description: '' }

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
</script> 