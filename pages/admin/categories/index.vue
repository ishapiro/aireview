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
                    @click="openCategoryPopulator(category)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Generate Reviews
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
                />
                <Button
                  type="button"
                  label="Search Unsplash"
                  icon="pi pi-search"
                  @click="openUnsplashDialog"
                  :disabled="!form.name.trim() || !isUnsplashConfigured"
                  :title="!isUnsplashConfigured ? 'Unsplash API not configured' : 'Search for images on Unsplash'"
                />
                <Button
                  v-if="form.image_url"
                  type="button"
                  label="Remove Image"
                  icon="pi pi-trash"
                  @click="form.image_url = ''"
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

    <!-- Unsplash Image Search Dialog -->
    <Dialog
      v-model:visible="showUnsplashDialog"
      modal
      header="Search Unsplash Images"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      :closable="!isSearchingImages"
    >
      <div class="space-y-4">
        <!-- Search Input -->
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <InputText
              v-model="unsplashSearchQuery"
              placeholder="Search for images..."
              class="w-full"
              :disabled="isSearchingImages"
              @keyup.enter="searchUnsplashImages"
            />
          </div>
          <Button
            @click="searchUnsplashImages"
            :loading="isSearchingImages"
            :disabled="!unsplashSearchQuery.trim()"
            label="Search"
            icon="pi pi-search"
          />
        </div>

        <!-- Search Results -->
        <div v-if="unsplashImages.length > 0" class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">
              Found {{ totalImages }} images for "{{ unsplashSearchQuery }}"
            </h3>
            <div class="flex items-center space-x-2">
              <Button
                @click="previousPage"
                :disabled="currentPage === 1 || isSearchingImages"
                icon="pi pi-chevron-left"
                size="small"
              />
              <span class="text-sm text-gray-600">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <Button
                @click="nextPage"
                :disabled="currentPage >= totalPages || isSearchingImages"
                icon="pi pi-chevron-right"
                size="small"
              />
            </div>
          </div>

          <!-- Image Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              v-for="image in unsplashImages"
              :key="image.id"
              class="relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200"
              :class="selectedImage?.id === image.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'"
              @click="selectImage(image)"
            >
              <img
                :src="image.urls.small"
                :alt="image.alt_description || 'Unsplash image'"
                class="w-full h-32 object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div v-if="selectedImage?.id === image.id" class="bg-blue-500 text-white rounded-full p-2">
                  <i class="pi pi-check"></i>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <p class="text-white text-xs truncate">
                  by {{ image.user.name }}
                </p>
              </div>
            </div>
          </div>

          <!-- Selection Actions -->
          <div v-if="selectedImage" class="flex justify-between items-center pt-4 border-t">
            <div class="text-sm text-gray-600">
              Selected: <span class="font-medium">{{ selectedImage.alt_description || 'Untitled' }}</span>
            </div>
            <div class="flex space-x-2">
              <Button
                @click="useSelectedImage"
                label="Use This Image"
                icon="pi pi-check"
              />
              <Button
                @click="selectedImage = null"
                label="Clear Selection"
              />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="isSearchingImages" class="flex justify-center items-center py-12">
          <div class="text-center">
            <i class="pi pi-spin pi-spinner text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-600">Searching for images...</p>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="hasSearched && unsplashImages.length === 0" class="text-center py-12">
          <i class="pi pi-search text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">No images found for "{{ unsplashSearchQuery }}"</p>
          <p class="text-sm text-gray-500 mt-2">Try a different search term</p>
        </div>

        <!-- Initial State -->
        <div v-else class="text-center py-12">
          <i class="pi pi-image text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">Search for images to use as your category image</p>
          <p class="text-sm text-gray-500 mt-2">Enter a search term above to get started</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            @click="closeUnsplashDialog"
            label="Close"
            :disabled="isSearchingImages"
          />
        </div>
      </template>
    </Dialog>

    <Toast />
    <ConfirmDialog class="w-4/5" />

    <!-- Category Populator Component -->
    <CategoryPopulator
      v-if="selectedCategoryForPopulation"
      :category="selectedCategoryForPopulation"
      @close="selectedCategoryForPopulation = null"
    />
  </div>
</template>

<script setup>
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useImageUpload } from '@/composables/useImageUpload'
import { slugify, generateUniqueSlug } from '@/utils/string'
import { nextTick } from 'vue'

const client = useSupabaseClient()
const toast = useToast()
const confirm = useConfirm()
const { uploadCategoryImage } = useImageUpload()

const showDialog = ref(false)
const isSubmitting = ref(false)
const editingCategory = ref(null)
const selectedCategoryForPopulation = ref(null)

// Unsplash dialog state
const showUnsplashDialog = ref(false)
const isSearchingImages = ref(false)
const unsplashSearchQuery = ref('')
const unsplashImages = ref([])
const selectedImage = ref(null)
const currentPage = ref(1)
const totalImages = ref(0)
const totalPages = ref(0)
const hasSearched = ref(false)

// Unsplash API configuration
const config = useRuntimeConfig()
const UNSPLASH_ACCESS_KEY = config.public.unsplashAccessKey

// Check if Unsplash API is configured
const isUnsplashConfigured = computed(() => {
  return !!UNSPLASH_ACCESS_KEY
})

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

const generateSlug = async (name) => {
  const baseSlug = slugify(name)
  
  // Get existing slugs to check for uniqueness
  const { data: existingCategories } = await client
    .from('categories')
    .select('slug')
  
  const existingSlugs = existingCategories?.map(cat => cat.slug) || []
  
  return generateUniqueSlug(baseSlug, existingSlugs)
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
    const slug = await generateSlug(form.value.name)
    
    const categoryData = {
      name: form.value.name,
      slug: slug,
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
    message: 'Are you sure you want to delete this category? This will remove the category from all associated reviews but will not delete the reviews themselves.',
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-info',
    accept: async () => {
      try {
        // First, remove all category associations from reviews
        const { error: associationError } = await client
          .from('review_categories')
          .delete()
          .eq('category_id', id)

        if (associationError) throw associationError

        // Then delete the category itself
        const { error: categoryError } = await client
          .from('categories')
          .delete()
          .eq('id', id)

        if (categoryError) throw categoryError

        // Remove the category from the list
        categories.value = categories.value.filter(category => category.id !== id)

        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category deleted successfully. All associated reviews have been preserved.',
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

// Unsplash API functions
const openUnsplashDialog = () => {
  console.log('Opening Unsplash dialog')
  console.log('Form name:', form.value.name)
  console.log('Unsplash configured:', isUnsplashConfigured.value)
  
  if (!isUnsplashConfigured.value) {
    toast.add({
      severity: 'error',
      summary: 'Configuration Error',
      detail: 'Unsplash API is not configured. Please add NUXT_PUBLIC_UNSPLASH_ACCESS_KEY to your environment variables.',
      life: 5000
    })
    return
  }
  
  showUnsplashDialog.value = true
  unsplashSearchQuery.value = form.value.name || ''
  
  console.log('Set search query to:', unsplashSearchQuery.value)
  
  // Use nextTick to ensure the dialog is rendered before searching
  nextTick(() => {
    if (unsplashSearchQuery.value && unsplashSearchQuery.value.trim()) {
      console.log('Auto-searching with:', unsplashSearchQuery.value)
      searchUnsplashImages()
    }
  })
}

const closeUnsplashDialog = () => {
  showUnsplashDialog.value = false
  unsplashImages.value = []
  selectedImage.value = null
  currentPage.value = 1
  totalImages.value = 0
  totalPages.value = 0
  hasSearched.value = false
  unsplashSearchQuery.value = ''
}

const searchUnsplashImages = async (page) => {
  const pageNumber = typeof page === 'number' ? page : 1
  console.log('Search query:', unsplashSearchQuery.value)
  console.log('API key available:', !!UNSPLASH_ACCESS_KEY)
  
  if (!unsplashSearchQuery.value || !unsplashSearchQuery.value.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please enter a search term',
      life: 3000
    })
    return
  }

  isSearchingImages.value = true
  hasSearched.value = true

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashSearchQuery.value.trim())}&page=${pageNumber}&per_page=10`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()
    
    unsplashImages.value = data.results || []
    totalImages.value = data.total || 0
    totalPages.value = Math.ceil(totalImages.value / 10)
    currentPage.value = pageNumber
    selectedImage.value = null

    if (data.results.length === 0) {
      toast.add({
        severity: 'info',
        summary: 'No Results',
        detail: `No images found for "${unsplashSearchQuery.value}"`,
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error searching Unsplash:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to search Unsplash: ${error.message}`,
      life: 5000
    })
  } finally {
    isSearchingImages.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    searchUnsplashImages(currentPage.value + 1)
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    searchUnsplashImages(currentPage.value - 1)
  }
}

const selectImage = (image) => {
  selectedImage.value = image
}

const useSelectedImage = () => {
  if (selectedImage.value) {
    form.value.image_url = selectedImage.value.urls.regular
    closeUnsplashDialog()
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Image selected successfully',
      life: 3000
    })
  }
}

const openCategoryPopulator = (category) => {
  selectedCategoryForPopulation.value = category
}

definePageMeta({
  middleware: ['auth-admin']
})
</script> 